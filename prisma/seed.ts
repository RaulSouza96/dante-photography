import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hash = await bcrypt.hash('5380422', 12)

  await prisma.user.upsert({
    where: { login: 'Raulcastro' },
    update: {},
    create: {
      id: 'admin-main',
      name: 'Raul Castro',
      login: 'Raulcastro',
      password: hash,
      role: 'admin',
      discord: 'raulcastro',
      status: 'active',
    },
  })

  const categories = [
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
  ]

  for (const [id, name, emoji, type] of categories) {
    await prisma.category.upsert({ where: { id }, update: {}, create: { id, name, emoji, type: type as any } })
  }

  await prisma.settings.upsert({
    where: { id: 'main' },
    update: {},
    create: {
      id: 'main',
      siteName: 'DANTE Photography',
      primaryColor: '#D4AF37',
      watermarkText: 'DANTE',
      footerText: 'DANTE Photography - Fotografia Profissional GTA RP',
    },
  })

  console.log('✅ Seed completo: admin + ' + categories.length + ' categorias + settings')
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
