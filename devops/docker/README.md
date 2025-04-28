# CloudBridge Platform Docker Environment

???�렉?�리??CloudBridge Platform??로컬 개발 �??�스?��? ?�한 Docker ?�경 ?�정???�함?�니??

## ?�함???�비??

### ?�이?�베?�스

- **MongoDB** (?�트: 27017) - ?�랫??메인 API???�이?�베?�스
- **PostgreSQL** (?�트: 5432) - ?�랫??메뉴 API???�이?�베?�스
- **Redis** (?�트: 6379) - 캐싱 �??�션 관�?

### 메시�?�??�트리밍

- **Kafka** (?�트: 9092) - ?�벤???�트리밍
- **Zookeeper** (?�트: 2181) - Kafka ?�러?�터 관�?

### 분석 �?모니?�링

- **ClickHouse** (?�트: 8123, 9000) - 분석 ?�이?�베?�스
- **Grafana** (?�트: 3000) - ?�?�보??�??�각??
- **Prometheus** (?�트: 9090) - 메트�??�집
- **Loki** (?�트: 3100) - 로그 집계

### ?�플리�??�션

- **platform-main** (?�트: 4000) - 메인 API (OAuth ?�함)
- **platform-menu** (?�트: 4100) - 메뉴 API

## ?�용 방법

### ?�행

```bash
# Linux/Mac
./scripts/start_local.sh

# Windows PowerShell
.\scripts\start_local.ps1
```

### 중�?

```bash
# Linux/Mac
./scripts/stop_local.sh

# Windows PowerShell
.\scripts\stop_local.ps1
```

## ?�경 변??

### platform-main

- `MONGO_URL`: MongoDB ?�결 URL
- `REDIS_URL`: Redis ?�결 URL
- `SECRET_KEY`: JWT ?�명??비�? ??
- `GOOGLE_CLIENT_ID`: Google OAuth ?�라?�언??ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth ?�라?�언??Secret
- `NAVER_CLIENT_ID`: Naver OAuth ?�라?�언??ID
- `NAVER_CLIENT_SECRET`: Naver OAuth ?�라?�언??Secret

### platform-menu

- `POSTGRES_URL`: PostgreSQL ?�결 URL
- `REDIS_URL`: Redis ?�결 URL

## ?�속 ?�보

### ?�이?�베?�스 ?�결

- **MongoDB**: `mongodb://localhost:27017/cloudbridge`
- **PostgreSQL**: `postgresql://cloudbridge:pass@localhost:5432/cloudbridge`
- **Redis**: `redis://localhost:6379`

### ???�터?�이??

- **Grafana**: [http://localhost:3000](http://localhost:3000) (?�용?? admin, 비�?번호: admin)
- **Prometheus**: [http://localhost:9090](http://localhost:9090)
- **ClickHouse**: [http://localhost:8123](http://localhost:8123)

## 주의?�항

- ???�정?� 개발 ?�경 ?�용?�니?? ?�로?�션?�서??추�? 보안 ?�정???�요?�니??
- ?�이?�는 Docker 볼륨???�?�되�? `docker compose down -v` 명령?�로 ??��?????�습?�다.
