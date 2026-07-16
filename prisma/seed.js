const bcrypt = require('bcryptjs');
const path = require('path');
const Database = require('better-sqlite3');

async function main() {
  const db = new Database(path.join(__dirname, 'dev.db'));
  const hash = await bcrypt.hash('5380422', 12);
  const id = 'admin-main';
  
  const existing = db.prepare("SELECT id FROM User WHERE login = ?").get('Raulcastro');
  if (!existing) {
    db.prepare(`INSERT INTO User (id, name, login, password, role, discord, phone, category, avatar, notes, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`).run(
      id, 'Raul Castro', 'Raulcastro', hash, 'admin', 'raulcastro', '', '', '', '', 'active'
    );
    console.log('✅ Admin Raulcastro criado');
  } else {
    console.log('✅ Admin Raulcastro já existe');
  }

  // Categories
  const cats = [
    ['eventos','Eventos','📷','general'],['casamento','Casamento','💍','general'],
    ['ensaio-fotografico','Ensaio Fotográfico','🌇','general'],['car-meet','Car Meet','🚗','general'],
    ['festas','Festas','🎉','general'],['torneios','Torneios','🏆','general'],
    ['familia','Família','👶','general'],['casas','Casas','🏠','general'],
    ['paisagens','Paisagens','🌅','general'],['vip','VIP','👑','general'],
    ['hospital','Hospital','🏥','legal'],['policia','Polícia','👮','legal'],
    ['mecanica','Mecânica','🔧','legal'],['restaurante','Restaurante','🍽️','legal'],
    ['prefeitura','Prefeitura','🏛️','legal'],['concessionaria','Concessionária','🚘','legal'],
    ['bombeiros','Bombeiros','🚒','legal'],['jornal','Jornal','📰','legal'],
    ['advogados','Advogados','⚖️','legal'],['tribunal','Tribunal','🏛️','legal'],
    ['cv','CV','🔴','faction'],['pcc','PCC','🟡','faction'],
    ['mafia-italiana','Máfia Italiana','🇮🇹','faction'],['yakuza','Yakuza','🇯🇵','faction'],
    ['bloods','Bloods','🩸','faction'],['ballas','Ballas','🟣','faction'],
    ['vagos','Vagos','🟢','faction'],['groove','Groove','💚','faction'],
    ['motoclube','Motoclube','🏍️','faction'],['mercenarios','Mercenários','⚔️','faction'],
  ];

  const ins = db.prepare("INSERT OR IGNORE INTO Category (id, name, emoji, type, createdAt) VALUES (?, ?, ?, ?, datetime('now'))");
  for (const [id, name, emoji, type] of cats) ins.run(id, name, emoji, type);

  // Settings
  const s = db.prepare("SELECT id FROM Settings WHERE id = 'main'").get();
  if (!s) {
    db.prepare("INSERT INTO Settings (id, siteName, primaryColor, watermarkText, footerText) VALUES ('main', 'DANTE Photography', '#D4AF37', 'DANTE', 'DANTE Photography - Fotografia Profissional GTA RP')").run();
  }

  console.log('✅ Seed completo: admin + ' + cats.length + ' categorias + settings');
  db.close();
}

main().catch(console.error);
