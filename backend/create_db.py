import mysql.connector

database = mysql.connector.connect(
    host="localhost",
    user="root",
    passwd="password123",
)

cursor = database.cursor()
cursor.execute("CREATE DATABASE IF NOT EXISTS websiteDataBase")
print("Database ready: websiteDataBase")
