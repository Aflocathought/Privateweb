import Fastify from "fastify";
import axios from "axios";
import fastifyCors from "@fastify/cors";

const server = Fastify();

server.register(fastifyCors, {
  origin: 'http://localhost:5173', // 允许的来源
  methods: ['GET', 'POST'], // 允许的方法
});

server.get("/", (req, reply) => {
  reply.type('text/html').send('<h1>Fastify Server is running...</h1>');
});

server.get("/api/v1/weather", async (req, reply) => {
  try {
    const response = await axios.get(
      `https://www.7timer.info/bin/astro.php?lon=${req.query.lon}&lat=${req.query.lat}&ac=0&lang=zh&unit=metric&output=json&tzshift=0`
    );
    reply.send(response.data);
  } catch (error) {
    reply.status(500).send('Error fetching weather data');
  }
});

server.get('/api/v1/images/bing', async (req, reply) => {
  try {
    const response = await axios.get('https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1');
    reply.send(response.data);
  } catch (error) {
    reply.status(500).send('Error fetching image data');
  }
});

server.get('/api/v1/images/unsplash', async (req, reply) => {
  try {
    const response = await axios.get('https://source.unsplash.com/random');
    reply.send(response.request.res.responseUrl);
  } catch (error) {
    reply.status(500).send('Error fetching image data');
  }
});
server.get('/api/v1/images/animation', async (req, reply) => {
  try {
    const response = await axios.get('https://t.alcy.cc/ycy');
    reply.send(response.request.res.responseUrl);
  } catch (error) {
    reply.status(500).send('Error fetching image data');
  }
});

server.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});