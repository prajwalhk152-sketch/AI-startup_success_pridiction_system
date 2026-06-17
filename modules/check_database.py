import sqlite3

conn = sqlite3.connect("database/startups.db")
cursor = conn.cursor()

cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cursor.fetchall()

print("Database Tables:")
print(tables)

conn.close()