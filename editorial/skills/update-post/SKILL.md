# Atualizar ou corrigir post

Use em URL existente. Leia regras de evidência, datas e intenção.

1. Confirme arquivo, slug, URL pública e estado. Registre publicação/data de atualização atuais; confira conteúdo, fontes e consultas por página quando disponíveis.
2. Defina o motivo: erro factual, resposta incompleta, exemplo não reproduzível, catálogo/versão desatualizados ou descrição/interlinks inadequados. Não revise só para mudar a data.
3. Pesquise fontes atuais e edite o corpo e metadados diretamente. `dougseo post update --slug <slug> --source <url>` apenas adiciona fontes e preserva `updatedDate`; não reescreve nem verifica fatos. Não o trate como revisão concluída.
4. Preserve slug, pubDate e autoria real. Para publicado, mantenha `draft: false` e `scheduled: false`; não use `schedule`. Restaure data anterior se a mudança foi cosmética. Revisão substancial recebe data real de atualização.
5. Corrija títulos, descrição, alt e outras promessas falsas. Remova importação/enchimento; adicione nota de correção quando o leitor puder ter sido induzido ao erro. Não mantenha `legado-importado` como justificativa para pular revisão.
6. Confira links de entrada/saída e intenção; não mude URL ou consolide artigos sem comparar conteúdo e evidência. Reuse capa adequada ou siga a skill de capa se precisar trocar.
7. Faça revisão factual manual e dos campos editoriais: a auditoria também valida publicados/legados, mas não certifica fatos. Rode audit/build e verificações proporcionais; depois commit/push/deploy dentro do escopo autorizado.
8. Registre diferenças, fontes, estado público e baseline/próxima avaliação; não prometa dobrar tráfego.
