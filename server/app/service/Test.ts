import { Service } from 'egg';

/**
 * Test Service
 */
export default class Test extends Service {

  public async findAll() {
    return await this.app.mysql.query('select * from websites');
  }

  public async detail(id) {
    return await this.app.mysql.query('select * from websites where id = ?', id);
  }
  public async edit(e) {
    return await this.app.mysql.query('UPDATE websites SET name = ?,url = ?,alexa=?,country=? WHERE id = ?', [e.name,e.url,e.alexa,e.country, e.id]);
  }
  public async insert(e) {
    return await this.app.mysql.query(`INSERT INTO websites (name, url,alexa,country) VALUES ('${e.name}', '${e.url?e.url:""}','${e.alexa?e.alexa:""}','${e.country?e.country:""}');`);
  }
  public async delete(id) {
    return await this.app.mysql.query('DELETE FROM websites WHERE id = ?', id);
  }
}
