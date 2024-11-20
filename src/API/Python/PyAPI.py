from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import SystemMonitor

app = FastAPI()

# 允许跨域请求
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 包含系统资源的路由
app.include_router(SystemMonitor.router, prefix="/api/v1/sysmonitor")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)