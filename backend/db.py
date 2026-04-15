"""SQLite database for watchlist, analysis history, backtests, and settings."""

import sqlite3
import os
import json
from datetime import datetime
from contextlib import contextmanager

DB_PATH = os.path.join(os.path.expanduser("~"), ".tradingagents", "trading_agent.db")


def ensure_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    with get_db() as conn:
        conn.executescript("""
            CREATE TABLE IF NOT EXISTS watchlist (
                ticker TEXT PRIMARY KEY,
                exchange TEXT DEFAULT 'NSE',
                name TEXT,
                added_at TEXT DEFAULT (datetime('now'))
            );

            CREATE TABLE IF NOT EXISTS analysis_history (
                task_id TEXT PRIMARY KEY,
                ticker TEXT NOT NULL,
                trade_date TEXT NOT NULL,
                signal TEXT,
                market_report TEXT,
                sentiment_report TEXT,
                news_report TEXT,
                fundamentals_report TEXT,
                investment_plan TEXT,
                trader_investment_plan TEXT,
                final_trade_decision TEXT,
                bull_history TEXT,
                bear_history TEXT,
                risk_aggressive_history TEXT,
                risk_conservative_history TEXT,
                risk_neutral_history TEXT,
                stats TEXT,
                duration_seconds REAL,
                entry_price REAL,
                exit_price REAL,
                pnl_amount REAL,
                pnl_pct REAL,
                pnl_status TEXT DEFAULT 'pending',
                created_at TEXT DEFAULT (datetime('now'))
            );

            CREATE TABLE IF NOT EXISTS backtest_runs (
                backtest_id TEXT PRIMARY KEY,
                ticker TEXT NOT NULL,
                initial_capital REAL DEFAULT 100000,
                position_size_pct REAL DEFAULT 10,
                enable_learning BOOLEAN DEFAULT 0,
                total_trades INTEGER DEFAULT 0,
                winning_trades INTEGER DEFAULT 0,
                losing_trades INTEGER DEFAULT 0,
                total_return_pct REAL DEFAULT 0,
                max_drawdown_pct REAL DEFAULT 0,
                final_portfolio_value REAL,
                status TEXT DEFAULT 'running',
                created_at TEXT DEFAULT (datetime('now'))
            );

            CREATE TABLE IF NOT EXISTS backtest_trades (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                backtest_id TEXT NOT NULL,
                trade_date TEXT NOT NULL,
                ticker TEXT NOT NULL,
                signal TEXT,
                entry_price REAL,
                exit_price REAL,
                pnl_amount REAL,
                pnl_pct REAL,
                cumulative_pnl REAL,
                portfolio_value REAL,
                duration_seconds REAL,
                FOREIGN KEY (backtest_id) REFERENCES backtest_runs(backtest_id)
            );

            CREATE TABLE IF NOT EXISTS settings (
                key TEXT PRIMARY KEY,
                value TEXT
            );
        """)


@contextmanager
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


# --- Watchlist ---

def get_watchlist() -> list[dict]:
    with get_db() as conn:
        rows = conn.execute("SELECT * FROM watchlist ORDER BY added_at DESC").fetchall()
        return [dict(r) for r in rows]


def add_to_watchlist(ticker: str, exchange: str = "NSE", name: str = None):
    with get_db() as conn:
        conn.execute(
            "INSERT OR REPLACE INTO watchlist (ticker, exchange, name) VALUES (?, ?, ?)",
            (ticker.upper(), exchange, name),
        )


def remove_from_watchlist(ticker: str):
    with get_db() as conn:
        conn.execute("DELETE FROM watchlist WHERE ticker = ?", (ticker.upper(),))


# --- Analysis History ---

def save_analysis(task_id: str, data: dict):
    with get_db() as conn:
        conn.execute(
            """INSERT OR REPLACE INTO analysis_history
            (task_id, ticker, trade_date, signal, market_report, sentiment_report,
             news_report, fundamentals_report, investment_plan, trader_investment_plan,
             final_trade_decision, bull_history, bear_history,
             risk_aggressive_history, risk_conservative_history, risk_neutral_history,
             stats, duration_seconds)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                task_id,
                data.get("ticker"),
                data.get("trade_date"),
                data.get("signal"),
                data.get("market_report"),
                data.get("sentiment_report"),
                data.get("news_report"),
                data.get("fundamentals_report"),
                data.get("investment_plan"),
                data.get("trader_investment_plan"),
                data.get("final_trade_decision"),
                data.get("bull_history"),
                data.get("bear_history"),
                data.get("risk_aggressive_history"),
                data.get("risk_conservative_history"),
                data.get("risk_neutral_history"),
                json.dumps(data.get("stats")) if data.get("stats") else None,
                data.get("duration_seconds"),
            ),
        )


def update_analysis_pnl(task_id: str, entry_price: float, exit_price: float, pnl_amount: float, pnl_pct: float, pnl_status: str):
    with get_db() as conn:
        conn.execute(
            "UPDATE analysis_history SET entry_price=?, exit_price=?, pnl_amount=?, pnl_pct=?, pnl_status=? WHERE task_id=?",
            (entry_price, exit_price, pnl_amount, pnl_pct, pnl_status, task_id),
        )


def get_analysis(task_id: str) -> dict | None:
    with get_db() as conn:
        row = conn.execute("SELECT * FROM analysis_history WHERE task_id = ?", (task_id,)).fetchone()
        if row:
            d = dict(row)
            if d.get("stats"):
                d["stats"] = json.loads(d["stats"])
            return d
        return None


def get_analysis_history(limit: int = 50, offset: int = 0) -> list[dict]:
    with get_db() as conn:
        rows = conn.execute(
            """SELECT task_id, ticker, trade_date, signal, duration_seconds,
                      entry_price, exit_price, pnl_pct, pnl_status, created_at
               FROM analysis_history ORDER BY created_at DESC LIMIT ? OFFSET ?""",
            (limit, offset),
        ).fetchall()
        return [dict(r) for r in rows]


# --- Backtest ---

def save_backtest_run(backtest_id: str, data: dict):
    with get_db() as conn:
        conn.execute(
            """INSERT OR REPLACE INTO backtest_runs
            (backtest_id, ticker, initial_capital, position_size_pct, enable_learning,
             total_trades, winning_trades, losing_trades, total_return_pct,
             max_drawdown_pct, final_portfolio_value, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                backtest_id,
                data.get("ticker"),
                data.get("initial_capital"),
                data.get("position_size_pct"),
                data.get("enable_learning"),
                data.get("total_trades", 0),
                data.get("winning_trades", 0),
                data.get("losing_trades", 0),
                data.get("total_return_pct", 0),
                data.get("max_drawdown_pct", 0),
                data.get("final_portfolio_value"),
                data.get("status", "running"),
            ),
        )


def save_backtest_trade(backtest_id: str, trade: dict):
    with get_db() as conn:
        conn.execute(
            """INSERT INTO backtest_trades
            (backtest_id, trade_date, ticker, signal, entry_price, exit_price,
             pnl_amount, pnl_pct, cumulative_pnl, portfolio_value, duration_seconds)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                backtest_id,
                trade.get("trade_date"),
                trade.get("ticker"),
                trade.get("signal"),
                trade.get("entry_price"),
                trade.get("exit_price"),
                trade.get("pnl_amount"),
                trade.get("pnl_pct"),
                trade.get("cumulative_pnl"),
                trade.get("portfolio_value"),
                trade.get("duration_seconds"),
            ),
        )


def get_backtest_run(backtest_id: str) -> dict | None:
    with get_db() as conn:
        row = conn.execute("SELECT * FROM backtest_runs WHERE backtest_id = ?", (backtest_id,)).fetchone()
        return dict(row) if row else None


def get_backtest_trades(backtest_id: str) -> list[dict]:
    with get_db() as conn:
        rows = conn.execute(
            "SELECT * FROM backtest_trades WHERE backtest_id = ? ORDER BY trade_date",
            (backtest_id,),
        ).fetchall()
        return [dict(r) for r in rows]


def get_backtest_history(limit: int = 20) -> list[dict]:
    with get_db() as conn:
        rows = conn.execute(
            "SELECT * FROM backtest_runs ORDER BY created_at DESC LIMIT ?", (limit,)
        ).fetchall()
        return [dict(r) for r in rows]


# --- Settings ---

def get_setting(key: str) -> str | None:
    with get_db() as conn:
        row = conn.execute("SELECT value FROM settings WHERE key = ?", (key,)).fetchone()
        return row["value"] if row else None


def set_setting(key: str, value: str | None):
    with get_db() as conn:
        if value is None or value == "":
            conn.execute("DELETE FROM settings WHERE key = ?", (key,))
        else:
            conn.execute(
                "INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)",
                (key, value),
            )


def get_all_settings() -> dict:
    with get_db() as conn:
        rows = conn.execute("SELECT key, value FROM settings").fetchall()
        return {r["key"]: r["value"] for r in rows}
