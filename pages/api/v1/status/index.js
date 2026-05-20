import database from "infra/database.js"

async function status(request, response) {
  const updatedAt = new Date().toISOString();
  const versionDB = await database.query("SHOW server_version;");
  const databaseVersionValue = versionDB.rows[0].server_version;
  const maxConectionDB = await database.query("SHOW max_connections;")
  const databaseName = process.env.DB_NAME;
  const databaseOpenedConnectionsResult = await database.query({
    text: `SELECT COUNT(*) FROM pg_stat_activity WHERE datname = $1;`,
    values: [databaseName],
  });

  const databaseOpenedConnectionsValue = databaseOpenedConnectionsResult.rows[0].count;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseVersionValue,
        max_connections: maxConectionDB.rows[0].max_connections,
        used_connections: databaseOpenedConnectionsValue,
      }
    },
  });
}

export default status;
