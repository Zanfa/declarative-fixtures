export interface QueryBuilder<T> {
  insert<T>(data: T): T & { id: number };
}

export interface Database {
  tables: { [key: string]: any[] };
  table<T>(name: string): QueryBuilder<T>;
}

export function inMemoryDatabase(): Database {
  const tables: { [key: string]: any[] } = {};

  return {
    tables,
    table(name: string) {
      return {
        insert<R>(data: R): R & { id: number } {
          if (!tables[name]) {
            tables[name] = [];
          }

          const row = { id: tables[name].length + 1, ...data };
          tables[name].push(row);

          return row;
        },
      };
    },
  };
}

export function printTables(db: Database) {
  Object.entries(db.tables).forEach(([name, rows]) => {
    console.log(name);
    console.log("|", Object.keys(rows[0]).join(" | "), "|");
    console.log(
      "|",
      Object.keys(rows[0])
        .map(() => "---")
        .join(" | "),
      "|"
    );
    rows
      .map((row) => Object.values(row))
      .forEach((values) => console.log("|", values.join(" | "), "|"));
  });
}
