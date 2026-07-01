from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class AppConfig(BaseSettings):
    model_config = SettingsConfigDict(
        env_prefix="MVP2WEEK_",
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    host: str = "127.0.0.1"
    port: int = 8000
    allowed_origins: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]
    catalog_path: Path = Path(__file__).resolve().parent.parent / "catalog.json"
    data_dir: Path = Path(__file__).resolve().parent.parent / "data"
    db_filename: str = "app.db"

    @property
    def db_url(self) -> str:
        return f"sqlite:///{self.data_dir / self.db_filename}"


config = AppConfig()