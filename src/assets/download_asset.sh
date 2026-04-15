#!/bin/bash

# 显示资源包清单
show_asset_list() {
    echo "可选资源包:"
    python - <<'PY'
import json
from pathlib import Path

catalog_path = Path(__file__).resolve().parent / "catalog.json"
with catalog_path.open("r", encoding="utf-8") as f:
    catalog = json.load(f)

for pack in catalog.get("downloadable_packs", []):
    print(f"  - {pack['name']}: {pack['purpose']} ({pack['status']})")
PY
}

# 参数处理
if [ $# -eq 0 ] || [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    echo "错误: 请提供资源包名作为参数"
    echo "使用方法: $0 <资源包名>"
    echo "示例: $0 sgz_ui_core"
    echo "查看资源包列表: $0 --list"
    exit 1
fi

if [ "$1" = "--list" ]; then
    show_asset_list
    exit 0
fi

RESOURCE_NAME="$1"

# 配置基础URL
BASE_URL="https://miaoda-app-rs.bj.bcebos.com/game_assets"

# 构建完整的下载URL
DOWNLOAD_URL="${BASE_URL}/${RESOURCE_NAME}.zip"

# 设置输出文件名
FILENAME="${RESOURCE_NAME}.zip"

echo "开始下载资源: ${FILENAME}"
echo "资源包名: ${RESOURCE_NAME}"
echo "下载URL: ${DOWNLOAD_URL}"

# 使用wget下载
wget -O "${FILENAME}" "${DOWNLOAD_URL}"

# 检查下载是否成功
if [ $? -ne 0 ]; then
    echo "错误: 下载失败"
    exit 1
fi

echo "下载完成: ${FILENAME}"

# 解压缩文件
echo "开始解压缩..."
unzip -q "${FILENAME}"

# 检查解压是否成功
if [ $? -ne 0 ]; then
    echo "错误: 解压失败"
    exit 1
fi

echo "解压完成"

# 删除压缩包
echo "删除压缩包: ${FILENAME}"
rm "${FILENAME}"

echo "所有操作完成!"
