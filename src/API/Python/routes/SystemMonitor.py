from fastapi import APIRouter
import time
import psutil

router = APIRouter()

# 简单的缓存实现
cache = [[0, 0, 0]]
unit = ["b/s", "kb/s", "mb/s", "gb/s", "tb/s"]


def cache_check():
    n = len(cache)
    for item in cache:
        print(item)
    print(n)


def cache_network_info(now, upload, download):
    global cache
    if len(cache) > 10:
        cache.pop()
    cache.insert(0, [now, upload, download])


def calc_byte(num):
    count = 0
    while num > 1024:
        num /= 1024
        count += 1
    return f"{num:.2f} {unit[count]}"


def get_network_info():
    network_io = psutil.net_io_counters()[:4]
    upnow = network_io[0]
    downnow = network_io[1]
    now = time.time()
    cache_network_info(now, upnow, downnow)
    up = calc_byte((cache[0][1] - cache[1][1]) / (cache[0][0] - cache[1][0]))
    down = calc_byte((cache[0][2] - cache[1][2]) / (cache[0][0] - cache[1][0]))
    network_info = {
        "upTotal": upnow,
        "downTotal": downnow,
        "up": up,
        "down": down,
    }
    # cache_check()
    return network_info


@router.get("/all")
def get_all_info():
    s = time.time()
    cpu = psutil.cpu_percent(interval=1)
    memory = psutil.virtual_memory()
    network_info = get_network_info()
    e = time.time()
    time_cost = e - s
    return {
        "cpu": cpu,
        "memory": {
            "total": memory.total,
            "available": memory.available,
            "percent": memory.percent,
            "used": memory.used,
            "free": memory.free,
        },
        "network": network_info,
        "response_time": time_cost,
    }


@router.get("/cpu")
def get_cpu_usage():
    return {"cpu_usage": psutil.cpu_percent(interval=1)}


@router.get("/memory")
def get_memory_usage():
    memory = psutil.virtual_memory()
    return {
        "total": memory.total,
        "available": memory.available,
        "percent": memory.percent,
        "used": memory.used,
        "free": memory.free,
    }


@router.get("/network")
def get_network_usage():
    net_io = psutil.net_io_counters()
    return {
        "bytes_sent": net_io.bytes_sent,
        "bytes_recv": net_io.bytes_recv,
        "packets_sent": net_io.packets_sent,
        "packets_recv": net_io.packets_recv,
    }
