import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma'
import { PrismaNeon } from '@prisma/adapter-neon'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)
const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Starting seed...')

  // 🔥 RESET REAL (borra TODO y reinicia IDs desde 1)
  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE "Games", "console"
    RESTART IDENTITY CASCADE;
  `)

  console.log('🧹 Database cleaned & IDs reset')

  // 2. Crear Consolas
  await prisma.console.createMany({
    data: [
      { name: 'PlayStation 5', manufacturer: 'Sony Interactive Entertainment', releaseDate: new Date('2020-11-12'), description: 'Console de nueva generación con soporte 4K.' },
      { name: 'Xbox Series X', manufacturer: 'Microsoft', releaseDate: new Date('2020-11-10'), description: 'Alta potencia gráfica y rendimiento.' },
      { name: 'Nintendo Switch OLED Model', manufacturer: 'Nintendo', releaseDate: new Date('2021-10-08'), description: 'Consola híbrida con pantalla OLED.' },
      { name: 'Nintendo Switch 2', manufacturer: 'Nintendo', releaseDate: new Date('2025-06-05'), description: 'Próxima generación de Nintendo.' },
      { name: 'Steam Deck OLED', manufacturer: 'Valve', releaseDate: new Date('2023-11-16'), description: 'PC portátil de alto rendimiento.' },
    ],
  })

  console.log('🎮 Consoles seeded')

  // 3. Obtener consolas
  const consoles = await prisma.console.findMany()
  const getC = (name: string) => consoles.find(c => c.name === name)?.id

  // 4. Juegos
  const games = [
    { title: 'God of War Ragnarök', developer: 'Santa Monica', releaseDate: new Date('2022-11-09'), price: 69.99, genre: 'Action', description: 'Kratos y Atreus.', console_id: getC('PlayStation 5') },
    { title: 'Halo Infinite', developer: '343 Industries', releaseDate: new Date('2021-12-08'), price: 59.99, genre: 'Shooter', description: 'Master Chief.', console_id: getC('Xbox Series X') },
    { title: 'Zelda Tears of the Kingdom', developer: 'Nintendo', releaseDate: new Date('2023-05-12'), price: 69.99, genre: 'Adventure', description: 'Hyrule.', console_id: getC('Nintendo Switch OLED Model') },
    { title: 'Elden Ring', developer: 'FromSoftware', releaseDate: new Date('2022-02-25'), price: 59.99, genre: 'RPG', description: 'Mundo abierto.', console_id: getC('PlayStation 5') },
    { title: 'Forza Horizon 5', developer: 'Playground', releaseDate: new Date('2021-11-09'), price: 59.99, genre: 'Racing', description: 'México.', console_id: getC('Xbox Series X') },
    { title: 'Pokémon Scarlet', developer: 'Game Freak', releaseDate: new Date('2022-11-18'), price: 59.99, genre: 'RPG', description: 'Paldea.', console_id: getC('Nintendo Switch OLED Model') },
    { title: 'Spider-Man 2', developer: 'Insomniac', releaseDate: new Date('2023-10-20'), price: 69.99, genre: 'Action', description: 'Peter y Miles.', console_id: getC('PlayStation 5') },
    { title: 'Starfield', developer: 'Bethesda', releaseDate: new Date('2023-09-06'), price: 69.99, genre: 'RPG', description: 'Espacio.', console_id: getC('Xbox Series X') },
    { title: 'Mario Kart 9', developer: 'Nintendo', releaseDate: new Date('2025-12-01'), price: 59.99, genre: 'Racing', description: 'Next-gen.', console_id: getC('Nintendo Switch 2') },
    { title: 'Hogwarts Legacy', developer: 'Avalanche', releaseDate: new Date('2023-02-10'), price: 59.99, genre: 'Action RPG', description: 'Magia.', console_id: getC('Steam Deck OLED') },

    { title: 'Modern Warfare II', developer: 'Infinity Ward', releaseDate: new Date('2022-10-28'), price: 69.99, genre: 'FPS', description: 'Guerra.', console_id: getC('PlayStation 5') },
    { title: 'Resident Evil 4', developer: 'Capcom', releaseDate: new Date('2023-03-24'), price: 59.99, genre: 'Horror', description: 'Remake.', console_id: getC('PlayStation 5') },
    { title: 'FC 24', developer: 'EA Sports', releaseDate: new Date('2023-09-29'), price: 69.99, genre: 'Sports', description: 'Fútbol.', console_id: getC('PlayStation 5') },
    { title: 'Cyberpunk 2077', developer: 'CD Projekt', releaseDate: new Date('2020-12-10'), price: 49.99, genre: 'RPG', description: 'Night City.', console_id: getC('Xbox Series X') },
    { title: 'The Last of Us Part I', developer: 'Naughty Dog', releaseDate: new Date('2022-09-02'), price: 69.99, genre: 'Action', description: 'Joel y Ellie.', console_id: getC('PlayStation 5') },
    { title: 'Baldur’s Gate 3', developer: 'Larian', releaseDate: new Date('2023-08-03'), price: 59.99, genre: 'RPG', description: 'D&D.', console_id: getC('PlayStation 5') },
    { title: 'Red Dead 2', developer: 'Rockstar', releaseDate: new Date('2018-10-26'), price: 39.99, genre: 'Action', description: 'Vaqueros.', console_id: getC('Xbox Series X') },
    { title: 'The Witcher 3', developer: 'CD Projekt', releaseDate: new Date('2015-05-19'), price: 29.99, genre: 'RPG', description: 'Geralt.', console_id: getC('PlayStation 5') },
    { title: 'Final Fantasy XVI', developer: 'Square Enix', releaseDate: new Date('2023-06-22'), price: 69.99, genre: 'RPG', description: 'Valisthea.', console_id: getC('PlayStation 5') },
    { title: 'Tekken 8', developer: 'Bandai Namco', releaseDate: new Date('2024-01-26'), price: 69.99, genre: 'Fighting', description: 'Iron Fist.', console_id: getC('PlayStation 5') },

    { title: 'Street Fighter 6', developer: 'Capcom', releaseDate: new Date('2023-06-02'), price: 59.99, genre: 'Fighting', description: 'Lucha.', console_id: getC('PlayStation 5') },
    { title: 'Minecraft', developer: 'Mojang', releaseDate: new Date('2011-11-18'), price: 26.99, genre: 'Sandbox', description: 'Bloques.', console_id: getC('Nintendo Switch OLED Model') },
    { title: 'Apex Legends', developer: 'Respawn', releaseDate: new Date('2019-02-04'), price: 0, genre: 'Battle Royale', description: 'Héroes.', console_id: getC('PlayStation 5') },
    { title: 'Sea of Thieves', developer: 'Rare', releaseDate: new Date('2018-03-20'), price: 39.99, genre: 'Adventure', description: 'Piratas.', console_id: getC('Xbox Series X') },
    { title: 'Diablo IV', developer: 'Blizzard', releaseDate: new Date('2023-06-06'), price: 69.99, genre: 'Action RPG', description: 'Infierno.', console_id: getC('PlayStation 5') },
    { title: 'Ratchet & Clank', developer: 'Insomniac', releaseDate: new Date('2021-06-11'), price: 69.99, genre: 'Platformer', description: 'Dimensiones.', console_id: getC('PlayStation 5') },
    { title: 'Returnal', developer: 'Housemarque', releaseDate: new Date('2021-04-30'), price: 69.99, genre: 'Roguelike', description: 'Ciclo.', console_id: getC('PlayStation 5') },
    { title: 'Ghost of Tsushima', developer: 'Sucker Punch', releaseDate: new Date('2020-07-17'), price: 59.99, genre: 'Action', description: 'Samurái.', console_id: getC('PlayStation 5') },
    { title: 'Death Stranding', developer: 'Kojima', releaseDate: new Date('2019-11-08'), price: 49.99, genre: 'Action', description: 'Sam Bridges.', console_id: getC('PlayStation 5') },
    { title: 'Horizon Forbidden West', developer: 'Guerrilla', releaseDate: new Date('2022-02-18'), price: 59.99, genre: 'Action', description: 'Aloy.', console_id: getC('PlayStation 5') },

    { title: 'Bloodborne', developer: 'FromSoftware', releaseDate: new Date('2015-03-24'), price: 19.99, genre: 'Action RPG', description: 'Cacería.', console_id: getC('PlayStation 5') },
    { title: 'Demon Souls', developer: 'Bluepoint', releaseDate: new Date('2020-11-12'), price: 69.99, genre: 'Action RPG', description: 'Almas.', console_id: getC('PlayStation 5') },
    { title: 'Doom Eternal', developer: 'id Software', releaseDate: new Date('2020-03-20'), price: 59.99, genre: 'Shooter', description: 'Infierno.', console_id: getC('Xbox Series X') },
    { title: 'Psychonauts 2', developer: 'Double Fine', releaseDate: new Date('2021-08-25'), price: 59.99, genre: 'Platformer', description: 'Mente.', console_id: getC('Xbox Series X') },
    { title: 'Gears 5', developer: 'The Coalition', releaseDate: new Date('2019-09-10'), price: 39.99, genre: 'Shooter', description: 'Sera.', console_id: getC('Xbox Series X') },
    { title: 'Metroid Dread', developer: 'Nintendo', releaseDate: new Date('2021-10-08'), price: 59.99, genre: 'Action', description: 'Samus.', console_id: getC('Nintendo Switch OLED Model') },
    { title: 'Animal Crossing', developer: 'Nintendo', releaseDate: new Date('2020-03-20'), price: 59.99, genre: 'Simulation', description: 'Isla.', console_id: getC('Nintendo Switch OLED Model') },
    { title: 'Smash Ultimate', developer: 'Nintendo', releaseDate: new Date('2018-12-07'), price: 59.99, genre: 'Fighting', description: 'Fighters.', console_id: getC('Nintendo Switch OLED Model') },
    { title: 'Splatoon 3', developer: 'Nintendo', releaseDate: new Date('2022-09-09'), price: 59.99, genre: 'Shooter', description: 'Tinta.', console_id: getC('Nintendo Switch OLED Model') },
    { title: 'Mario Odyssey', developer: 'Nintendo', releaseDate: new Date('2017-10-27'), price: 59.99, genre: 'Platformer', description: 'Cappy.', console_id: getC('Nintendo Switch OLED Model') },

    { title: 'Hades', developer: 'Supergiant', releaseDate: new Date('2020-09-17'), price: 24.99, genre: 'Roguelike', description: 'Escape.', console_id: getC('Nintendo Switch OLED Model') },
    { title: 'Bayonetta 3', developer: 'PlatinumGames', releaseDate: new Date('2022-10-28'), price: 59.99, genre: 'Action', description: 'Bruja.', console_id: getC('Nintendo Switch OLED Model') },
    { title: 'Disco Elysium', developer: 'ZA/UM', releaseDate: new Date('2019-10-15'), price: 39.99, genre: 'RPG', description: 'Detective.', console_id: getC('Steam Deck OLED') },
    { title: 'Outer Wilds', developer: 'Mobius', releaseDate: new Date('2019-05-28'), price: 24.99, genre: 'Exploration', description: 'Loop.', console_id: getC('Steam Deck OLED') },
    { title: 'Stardew Valley', developer: 'ConcernedApe', releaseDate: new Date('2016-02-26'), price: 14.99, genre: 'Sim', description: 'Granja.', console_id: getC('Steam Deck OLED') },
    { title: 'Cuphead', developer: 'MDHR', releaseDate: new Date('2017-09-29'), price: 19.99, genre: 'Action', description: 'Dibujos.', console_id: getC('Xbox Series X') },
    { title: 'Sekiro', developer: 'FromSoftware', releaseDate: new Date('2019-03-22'), price: 59.99, genre: 'Action', description: 'Shinobi.', console_id: getC('PlayStation 5') },
    { title: 'Persona 5 Royal', developer: 'Atlus', releaseDate: new Date('2019-10-31'), price: 59.99, genre: 'JRPG', description: 'Hearts.', console_id: getC('PlayStation 5') },
    { title: 'It Takes Two', developer: 'Hazelight', releaseDate: new Date('2021-03-26'), price: 39.99, genre: 'Co-op', description: 'May y Cody.', console_id: getC('PlayStation 5') },
    { title: 'Ori and the Will of the Wisps', developer: 'Moon Studios', releaseDate: new Date('2020-03-11'), price: 29.99, genre: 'Platformer', description: 'Bosque.', console_id: getC('Xbox Series X') }
  ]

  console.log('⏳ Inserting 50 games in order...')

  for (const game of games) {
    if (!game.console_id) {
      console.warn(`⚠️ Skipping ${game.title}`)
      continue
    }

    await prisma.games.create({
      data: game as any
    })

    console.log(`✅ ${game.title}`)
  }

  console.log('🕹️ Games seeded')
  console.log('✅ Seed completed')
}

main()
  .catch((e) => {
    console.error('❌ ERROR:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })