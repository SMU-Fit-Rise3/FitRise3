const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getMusicData = async function (req, res) {
    const userId = req.params.id;

    try {
        const musicData = await prisma.music.findMany({
            where: {
                userId: userId
            }
        });

        // 음악 데이터가 없는 경우
        if (!musicData || musicData.length === 0) {
            res.status(404).send('No music')
        }
        else
            // 음악 데이터가 있는 경우 클라이언트에 반환
            res.status(200).json({
                data: musicData,
            });
    } catch (error) {
        console.error('Error :', error);
        res.status(500).send('Error')
    }
};

exports.postMusicData = async function (req, res) {
    console.log("들어옴");
    const userId = req.params.id;  
    const musicUrls = req.body.musicUrls;  

    try {
        // 여러 개의 Music 객체 생성
        const musicPromises = musicUrls.map(async (music) => {
            return await prisma.music.create({
                data: {
                    musicName: music.name,
                    musicUrls: music.url, 
                    user: {
                        connect: { id: userId }
                    }
                }
            });
        });

        // 모든 음악 데이터 생성이 완료되면 응답
        const newMusics = await Promise.all(musicPromises);

        // 성공적인 응답을 보냄
        res.status(201).json({
            message: 'Music data created successfully',
            music: newMusics
        });
    } catch (error) {
        console.error('Error creating music data:', error);
        res.status(500).json({
            error: 'Failed to create music data',
            message: error.message
        });
    }
};