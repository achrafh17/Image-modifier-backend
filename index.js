const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
const sharp = require("sharp");
app.use(cors());
app.use(express.json());

//------------------------------------------------------------
app.post("/app", async (req, res) => {
  const image = await req.body.image;
  const margeTop = await req.body.margeTop;
  const margeBottom = await req.body.margeBottom;
  const margeLeft = await req.body.margeLeft;
  const margeRight = await req.body.margeRight;
  const rotate = await Number(req.body.rotate);
  const flip = await req.body.flip;
  const floop = await req.body.floop;
  const gray = await req.body.gray;
  const blur = await req.body.blur;
  const tint = await req.body.tint;
  const normalize = await req.body.normalize;
  const negate = await req.body.negate;
  const median = await req.body.median;
  const brightness = await req.body.brightness;
  const saturation = await req.body.saturation;
  const hue = await req.body.hue;

  if (!image) return res.status(400).json({ message: "image required" });
  const base = (await image.includes("base64,"))
    ? image.split("base64,")[1]
    : image;
  const imagebuffred = Buffer.from(base, "base64");

  let pipline = await sharp(imagebuffred);

  if (rotate) pipline = pipline.rotate(Number(rotate));
  if (flip === true) pipline = pipline.flip();
  if (gray === true) pipline = pipline.grayscale();
  if (floop === true) pipline = pipline.flop();
  if (blur > 0.3) pipline = pipline.blur(Number(blur));
  else if (blur > 0.3) {
    pipline = pipline.blur(Number(blur));
  }
  if (negate === true) pipline = pipline.negate();
  if (median === true) pipline = pipline.median(10);
  if (normalize === true) pipline = pipline.normalize();
  if (margeLeft || margeRight || margeTop || margeBottom)
    pipline = pipline.extend({
      top: Number(margeTop),
      bottom: Number(margeBottom),
      left: Number(margeLeft),
      right: Number(margeRight),
    });
  if (brightness || hue || saturation)
    pipline = pipline.modulate({
      brightness: Number(brightness),
      hue: Number(hue),
      saturation: Number(saturation),
    });

  if (tint) {
    const hex = tint.replace("#", "");
    pipline = pipline.tint({
      r: parseInt(hex.substring(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
    });
  }

  const imageoutput = await pipline.toBuffer();
  const imageoutputbase = await imageoutput.toString("base64");

  res.json({ imageoutput: imageoutputbase });
});

//------------------------------------------------------------
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
