const express = require("express");
const router = express.Router();
const db = require("../models");

// 특정 해쉬태그와 연관된 포스트 검색
router.get("/:tag", async (req, res, next) => {
  try {
    const posts = await db.Post.findAll({
      // join
      include: [
        {
          model: db.Hashtag,
          // 한글 및 특수문자가 URL에 포함되면 URI로 변환됨, 변환된 것을 다시 복호화
          where: { name: decodeURIComponent(req.params.tag) }
        },
        // 작성자 정보
        {
          model: db.User,
          attributes: ["id", "userId"]
        },
        {
          model: db.Comment,
          include: [
            {
              model: db.User
              // after: 비밀번호를 제외한 필드만 가져오도록 attr 설정하기
            }
          ]
        }
      ]
    });
    res.json(posts);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

module.exports = router;