# Solar

Espaço de trabalho local para uma equipa de agentes de IA, organizado como um sistema solar interativo.

A apresentação, as imagens, as instruções de arranque e o histórico encontram-se no [README principal](../README.md) e no [CHANGELOG](../CHANGELOG.md).

## Desenvolvimento

Requisitos: Node.js 24 ou superior e pnpm 10.33.0.

```powershell
pnpm install --frozen-lockfile
cd ..
npm run dev
```

Abrir http://127.0.0.1:5200. Para uma demonstração isolada, usar `npm run preview`.

## Aplicação Windows

```powershell
node scripts/build-solar.mjs
```

Este comando pressupõe os recursos nativos de empacotamento preparados. O instalador é gerado em `release-solar/`. A instalação usa `%LOCALAPPDATA%/Programs/solar` e conserva os dados em `%APPDATA%/Solar/workspace`.

## Licenças

Consultar a [licença Apache-2.0](LICENSE) e os [avisos de atribuição](NOTICE). As dependências e os recursos de terceiros mantêm os seus avisos próprios.
