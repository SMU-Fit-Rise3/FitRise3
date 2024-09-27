const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({});

exports.patchGifUrl = async function (req, res) {
    const userId = req.params.id
    const { characterUrl, gifUrls } = req.body
    try {
        // 캐릭터를 새로 생성
        const newCharacter = await prisma.character.create({
            data: {
                characterImageUrl: characterUrl,
                characterGifUrls: gifUrls,
                userId: userId, // 사용자 ID 추가
            },
        });
        res.status(201).json({ message: '캐릭터 url db저장 성공', newCharacter });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '캐릭터 url db저장중 문제발생.', error });
    }
}