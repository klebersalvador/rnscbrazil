class Transacoes {
  constructor(connection) {
    this.connection = connection;
  }

  commit() {
    return this.connection.query('COMMIT');
  }

  begin() {
    return this.connection.query('BEGIN');
  }

  rollback() {
    return this.connection.query('ROLLBACK');
  }
}
module.exports = Transacoes;