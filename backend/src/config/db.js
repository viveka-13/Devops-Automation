import mysql from 'mysql2/promise';

const db = {
  connection: null,

  async connect() {
    try {
      this.connection = await mysql.createConnection({
        host: process.env.DATABASE_HOST || 'localhost',
        port: Number(process.env.DATABASE_PORT || 3306),
        user: process.env.DATABASE_USER || 'root',
        password: process.env.DATABASE_PASSWORD || '',
        database: process.env.DATABASE_NAME || 'taskflow_pro'
      });

      console.log('MySQL connected successfully');
      return this.connection;
    } catch (error) {
      console.warn('MySQL not available. Continuing in development mode without DB connection.');
      this.connection = null;
      return null;
    }
  }
};

export default db;
