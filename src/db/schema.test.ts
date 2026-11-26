/// <reference types="node" />
// Solo esta prueba usa Node: aplica el esquema en el SQLite integrado de Node.
/**
 * Aplica las migraciones a un SQLite real en memoria (el que trae Node) y comprueba
 * que las reglas del esquema protegen los datos.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

const MIGRATIONS_DIR = join(__dirname, 'migrations');

function createDatabase() {
  const db = new DatabaseSync(':memory:');
  db.exec('PRAGMA foreign_keys = ON');
  const files = readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort();
  for (const file of files) {
    const sql = readFileSync(join(MIGRATIONS_DIR, file), 'utf8');
    for (const statement of sql.split('--> statement-breakpoint')) db.exec(statement);
  }
  return db;
}

describe('esquema de la base de datos', () => {
  let db: DatabaseSync;
  const count = (table: string) =>
    (db.prepare(`SELECT count(*) AS n FROM ${table}`).get() as { n: number }).n;

  beforeEach(() => {
    db = createDatabase();
    db.exec(`
      INSERT INTO equipment VALUES ('barra', 'Barra', 'barra');
      INSERT INTO exercise (id, name, equipment_id, is_compound) VALUES ('banca', 'Press de banca', 'barra', 1);
      INSERT INTO user_profile (id, display_name) VALUES ('u1', 'Atleta');
      INSERT INTO workout_session (id, user_id) VALUES ('s1', 'u1');
    `);
  });

  afterEach(() => db.close());

  it('crea el perfil con los ajustes por defecto y la fecha en UTC', () => {
    const profile = db
      .prepare('SELECT goal, unit, increment_kg, rest_seconds, updated_at FROM user_profile')
      .get();
    expect(profile).toMatchObject({
      goal: 'hypertrophy',
      unit: 'kg',
      increment_kg: 2.5,
      rest_seconds: 90,
    });
    expect(profile?.updated_at).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  });

  it('solo acepta incrementos de 1, 2.5 o 5 kg', () => {
    expect(() => db.exec('UPDATE user_profile SET increment_kg = 1.25')).toThrow(/CHECK/);
    expect(() => db.exec('UPDATE user_profile SET increment_kg = 1')).not.toThrow();
  });

  it('rechaza series fuera de rango y acepta series por tiempo', () => {
    const insertSet = (id: string, columns: string, values: string) =>
      db.exec(
        `INSERT INTO set_log (id, user_id, session_id, exercise_id, position, ${columns})
         VALUES ('${id}', 'u1', 's1', 'banca', 1, ${values})`,
      );
    expect(() => insertSet('a', 'weight_kg, reps', '80, 8')).not.toThrow();
    expect(() => insertSet('b', 'weight_kg, reps', '600, 8')).toThrow(/CHECK/);
    expect(() => insertSet('c', 'weight_kg, reps', '80, 101')).toThrow(/CHECK/);
    expect(() => insertSet('d', 'duration_s', '60')).not.toThrow();
  });

  it('rechaza referencias a filas que no existen', () => {
    expect(() =>
      db.exec(
        "INSERT INTO exercise (id, name, equipment_id, is_compound) VALUES ('x', 'X', 'no-existe', 0)",
      ),
    ).toThrow(/FOREIGN KEY/);
  });

  it('permite una sola rutina activa por usuario', () => {
    db.exec("INSERT INTO routine (id, user_id, name, is_active) VALUES ('r1', 'u1', 'PPL', 1)");
    expect(() =>
      db.exec("INSERT INTO routine (id, user_id, name, is_active) VALUES ('r2', 'u1', 'Otra', 1)"),
    ).toThrow(/UNIQUE/);
    expect(() =>
      db.exec("INSERT INTO routine (id, user_id, name, is_active) VALUES ('r3', 'u1', 'Vieja', 0)"),
    ).not.toThrow();
  });

  it('valida los días de la rutina: de 0 a 6 y sin repetir', () => {
    db.exec("INSERT INTO routine (id, user_id, name) VALUES ('r1', 'u1', 'PPL')");
    db.exec(
      "INSERT INTO routine_day (id, user_id, routine_id, weekday) VALUES ('d0', 'u1', 'r1', 0)",
    );
    const insertDay = (id: string, weekday: number) =>
      db.exec(
        `INSERT INTO routine_day (id, user_id, routine_id, weekday) VALUES ('${id}', 'u1', 'r1', ${weekday})`,
      );
    expect(() => insertDay('d7', 7)).toThrow(/CHECK/);
    expect(() => insertDay('dx', 0)).toThrow(/UNIQUE/);
  });

  it('guarda un solo peso corporal por día', () => {
    db.exec(
      "INSERT INTO body_weight (id, user_id, date, kg) VALUES ('w1', 'u1', '2026-11-26', 75)",
    );
    expect(() =>
      db.exec(
        "INSERT INTO body_weight (id, user_id, date, kg) VALUES ('w2', 'u1', '2026-11-26', 76)",
      ),
    ).toThrow(/UNIQUE/);
  });

  it('al borrar un entrenamiento borra sus series', () => {
    db.exec(
      "INSERT INTO set_log (id, user_id, session_id, exercise_id, position, weight_kg, reps) VALUES ('a', 'u1', 's1', 'banca', 1, 80, 8)",
    );
    db.exec("DELETE FROM workout_session WHERE id = 's1'");
    expect(count('set_log')).toBe(0);
  });
});
