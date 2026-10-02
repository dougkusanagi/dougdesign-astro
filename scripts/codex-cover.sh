#!/usr/bin/env bash
# Gera a capa de um post com o gerador de imagens do Codex CLI (image_gen), sem API key.
# Uso: scripts/codex-cover.sh <slug> "<descrição da cena>" [qualidade-jpg=88]
# Saída: src/assets/images/posts/<slug>.jpg (16:9). Registre prompt, alt e caminho no frontmatter.
set -euo pipefail

slug="${1:?uso: codex-cover.sh <slug> \"<descrição da cena>\"}"
scene="${2:?falta a descrição da cena}"
quality="${3:-88}"

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
dest="$root/src/assets/images/posts/$slug.jpg"
gen_dir="${CODEX_HOME:-$HOME/.codex}/generated_images"
work="$(mktemp -d)"
marker="$work/marker"
touch "$marker"
trap 'rm -rf "$work"' EXIT

codex login status 2>&1 | grep -qi "chatgpt" || { echo "codex não está logado com ChatGPT (codex login)" >&2; exit 1; }

prompt="Use a ferramenta integrada de geração de imagens (image_gen) para criar UMA imagem em proporção 16:9 para a capa de um artigo de blog. Cena: ${scene}. Regras: SEM texto, SEM letras, SEM números, SEM logotipos, SEM marcas, SEM arte oficial ou personagens protegidos de nenhum jogo; não pareça captura de tela nem prova de teste. Não use nenhuma outra ferramenta. No final, informe só o caminho do arquivo gerado."

(cd "$work" && timeout 600 codex exec --skip-git-repo-check -s read-only "$prompt" >"$work/codex.log" 2>&1) || {
  echo "codex exec falhou; veja o fim do log:" >&2; tail -20 "$work/codex.log" >&2; exit 1; }

src="$(find "$gen_dir" -type f -name '*.png' -newer "$marker" -printf '%T@ %p\n' 2>/dev/null | sort -n | tail -1 | cut -d' ' -f2-)"
[ -n "$src" ] || { echo "nenhuma imagem nova em $gen_dir" >&2; tail -20 "$work/codex.log" >&2; exit 1; }

python3 - "$src" "$dest" "$quality" <<'PY'
import sys
from PIL import Image
src, dest, q = sys.argv[1], sys.argv[2], int(sys.argv[3])
im = Image.open(src).convert("RGB")
w, h = im.size
if w < 1200:
    sys.exit(f"imagem pequena demais: {w}x{h}")
# recorta para 16:9 se necessário
target = 16 / 9
if abs(w / h - target) > 0.02:
    nh = int(w / target)
    if nh <= h:
        t = (h - nh) // 2; im = im.crop((0, t, w, t + nh))
    else:
        nw = int(h * target); l = (w - nw) // 2; im = im.crop((l, 0, l + nw, h))
im.save(dest, "JPEG", quality=q, optimize=True, progressive=True)
print(f"{dest} {im.size[0]}x{im.size[1]}")
PY
