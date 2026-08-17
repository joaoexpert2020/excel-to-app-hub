# My Financial Hub

Quero criar um aplicativo web completo de Controle Financeiro Pessoal, baseado em uma planilha Excel que utilizo atualmente chamada CONTROLE FINANCEIRO 2026.xlsx.

A planilha existente deve ser usada como referência PRINCIPAL para entender a lógica do sistema.

Não quero simplesmente transformar a planilha em uma tabela HTML.

Quero transformar a lógica da planilha em um aplicativo financeiro moderno, mantendo a forma como organizo minhas receitas e despesas, mas tornando o sistema muito mais fácil de utilizar, pesquisar, editar e analisar.

1. ESTRUTURA ATUAL DA PLANILHA

A planilha possui as seguintes abas:

RELATORIO

FINANCEIRO

COMIDA

CACHAÇA

CARTÃO

OUTROS

OUTRAS RECEITAS

A aplicação deve preservar a lógica dessas categorias.

2. COMO A PLANILHA FUNCIONA

Minha planilha é organizada principalmente por:

Descrição do lançamento

Categoria

Mês

Valor

As colunas representam os meses:

Janeiro

Fevereiro

Março

Abril

Maio

Junho

Julho

Agosto

Setembro

Outubro

Novembro

Dezembro

Atualmente, cada linha representa uma determinada despesa ou receita e os valores são distribuídos entre os meses.

Exemplo:

COMIDA

ESPETO:
Janeiro: R$ 58
Abril: R$ 42
Maio: R$ 88
Junho: R$ 123
Julho: R$ 57

PIZZA:
Janeiro: R$ 130,15
Março: R$ 70
Abril: R$ 15
Julho: R$ 122

O aplicativo deve manter essa lógica, porém internamente deve armazenar cada lançamento de maneira estruturada.

3. BANCO DE DADOS

NÃO utilizar a planilha como banco de dados principal.

Criar um banco de dados relacional.

A estrutura deve permitir armazenar:

Lançamentos

Campos sugeridos:

id

descrição

tipo

categoria

subcategoria

valor

data

mês

ano

forma_pagamento

conta

cartão

parcela_atual

total_parcelas

observação

criado_em

atualizado_em

O sistema deve permitir que uma mesma descrição tenha vários lançamentos em diferentes meses.

Por exemplo:

"ESPETO"

pode possuir:

Janeiro — R$ 58
Abril — R$ 42
Maio — R$ 88
Junho — R$ 123

Esses devem ser registros independentes no banco de dados, mesmo que tenham a mesma descrição.

4. TIPOS DE LANÇAMENTO

Criar pelo menos os seguintes tipos:

Receita

Despesa fixa

Despesa variável

Também criar suporte para:

Compra no cartão

Compra parcelada

Receita recorrente

Despesa recorrente

5. CATEGORIAS PRINCIPAIS

Criar inicialmente as seguintes categorias com base na planilha atual:

RECEITAS

Salário

Informática

Designer

Outras receitas

DESPESAS FIXAS

Telefone

Spotify

YouTube Premium

Faculdade

Plano de Saúde

As categorias devem ser editáveis posteriormente.

DESPESAS VARIÁVEIS

Comida

Cachaça

Gasolina Moto

Gasolina Carro

Cabelo

Sobrancelha

M

Cartão

Outros

6. CATEGORIAS DETALHADAS

Algumas categorias possuem uma segunda camada de detalhamento.

Exemplo:

COMIDA:

Espeto

Pizza

Peixe

Sorvete

Pão c/ Mor.

Churros

Salgado

Lanche

Carol

Trufa

CACHAÇA:

Cerveja Boa

Heineken

Ice

Jack Apple

Cerveja (Pai)

Drink

Gelo

Energético

Mansão

OUTROS:

Ficha Sinuca

Seda

Teclado Ajazz

Park Pereira

Chiclete

Cachoeira Dom.

JBL

Listerine

Doc Moto

Bomba de Ar (Pai)

CARTÃO:

Anel Carol

Bolsa Arthur (Inter)

PSN (MP)

Gasolina Moto

Controle PS5

Calça Moletom

Frete Placa Acústica

Barra Fixa

Pop Filter

Adaptador e Porta Beck

OUTRAS RECEITAS:

Bolsa Arthur

Diária Exp

Plantão

Cashback

Gasolina Ana

Saque Niver

Drum Kit

Emprestei Moto

Porta Beck

Esses valores devem ser importados da planilha e transformados em registros reais.

7. DASHBOARD

Criar uma tela inicial extremamente visual.

Mostrar no topo:

Receita total do mês

Despesas fixas

Despesas variáveis

Total de despesas

Saldo do mês

Fórmula:

RECEITAS - DESPESAS = SALDO

Também mostrar:

Total gasto no cartão

Total gasto com comida

Total gasto com bebida

Total gasto em outros

Maior categoria de despesa

8. SELETOR DE MÊS

O dashboard deve possuir um seletor de mês muito evidente.

Exemplo:

[ JANEIRO 2026 ▼ ]

Ao trocar o mês, todos os indicadores e gráficos devem ser atualizados automaticamente.

Também permitir:

Ano completo

Janeiro

Fevereiro

Março

etc.

9. VISÃO ANUAL

Criar uma tela mostrando os 12 meses lado a lado.

Exemplo:

CategoriaJanFevMarAbrMaiJunJulAgoSetOutNovDezReceitasDespesas FixasDespesas VariáveisTotal DespesasSaldo

Essa visão deve reproduzir a principal lógica da aba RELATORIO.

10. RELATÓRIO

Criar uma página equivalente à aba RELATORIO.

Mostrar:

RECEITAS

DESPESAS FIXAS

DESPESAS VARIÁVEIS

TOTAL DESPESAS

SALDO

Para cada mês.

Adicionar gráficos:

Evolução das receitas

Evolução das despesas

Evolução do saldo

Despesas por categoria

Comparação entre meses

11. TELA DE LANÇAMENTOS

Criar uma tela chamada "Lançamentos".

Mostrar todos os registros em uma tabela.

Colunas:

Data

Descrição

Categoria

Subcategoria

Tipo

Forma de pagamento

Valor

Mês

Ano

Permitir:

Adicionar

Editar

Excluir

Duplicar

Pesquisar

Filtrar

Ordenar

12. ADICIONAR DESPESA

Criar um botão destacado:

"+ NOVA DESPESA"

Ao clicar:

Abrir formulário contendo:

Descrição
Categoria
Subcategoria
Valor
Data
Forma de pagamento
Conta/cartão
Observação

Se for cartão:

Perguntar:

"Compra parcelada?"

[ ] Sim
[ ] Não

Se sim:

Valor total
Número de parcelas
Primeira parcela

O sistema deve distribuir automaticamente as parcelas nos meses seguintes.

13. CARTÃO

A aba CARTÃO da planilha possui uma característica importante:

algumas compras aparecem em vários meses.

Por exemplo:

PSN (MP)

Março — R$ 68,21
Abril — R$ 68,21
Maio — R$ 68,21
Junho — R$ 68,21
Julho — R$ 65,90
Agosto — R$ 65,90
Setembro — R$ 65,90
etc.

No aplicativo, isso deve ser tratado como uma compra parcelada/recorrente, e não como vários lançamentos completamente independentes.

Criar:

Cartões

Limite

Fechamento

Vencimento

Fatura atual

Faturas futuras

Compras parceladas

14. TELA DE CARTÃO

Mostrar:

Limite total
Limite utilizado
Limite disponível
Fatura atual
Próxima fatura

E uma lista:

Descrição | Parcela | Valor | Fatura

Exemplo:

PSN (MP)
5/12
R$ 65,90
Agosto/2026

15. COMIDA

Criar uma página específica para a categoria COMIDA.

Mostrar:

Total gasto com comida no mês

Média mensal

Maior gasto

Menor gasto

Gráfico de gastos por item.

Exemplo:

ESPETO
PIZZA
PEIXE
SORVETE
CHURROS
SALGADO
LANCHES

Permitir visualizar a evolução de cada item ao longo do ano.

16. CACHAÇA

Criar página específica para CACHAÇA.

Mostrar:

Total mensal

Total anual

Média mensal

Evolução ao longo dos meses

Gastos por produto

Criar gráfico comparativo entre:

Cerveja
Drink
Energético
Jack Apple
etc.

17. OUTROS

Criar página específica para OUTROS.

Mostrar os gastos detalhados e permitir filtros por mês.

18. OUTRAS RECEITAS

Criar página específica para OUTRAS RECEITAS.

Mostrar:

Total recebido

Receita por origem

Evolução mensal

Média mensal

Exemplo:

Bolsa Arthur
Diária EXP
Plantão
Cashback
Drum Kit
etc.

19. RECORRÊNCIAS

Identificar automaticamente possíveis despesas recorrentes existentes na planilha.

Por exemplo:

Spotify
YouTube Premium
Telefone
Faculdade
Plano de Saúde

Criar uma área:

"Despesas Recorrentes"

Permitir:

Criar

Editar

Pausar

Excluir

Definir:

Valor
Periodicidade
Dia
Categoria
Conta/cartão

20. IMPORTAÇÃO DA PLANILHA

Criar uma funcionalidade chamada:

"Importar planilha"

Aceitar:

XLSX

CSV

A importação deve reconhecer as abas da planilha.

Mapeamento inicial:

RELATORIO → relatórios/calculados
FINANCEIRO → receitas + despesas fixas + despesas variáveis
COMIDA → categoria Comida
CACHAÇA → categoria Cachaça
CARTÃO → categoria Cartão
OUTROS → categoria Outros
OUTRAS RECEITAS → receitas adicionais

IMPORTANTE:

Não importar as fórmulas da planilha como fórmulas.

Importar os valores e transformar esses valores em registros no banco de dados.

Os relatórios devem ser recalculados pelo próprio aplicativo.

21. CONVERSÃO DA ESTRUTURA DA PLANILHA

A planilha possui:

DESCRIÇÃO | JANEIRO | FEVEREIRO | MARÇO | ... | DEZEMBRO

Converter isso para uma estrutura normalizada.

Exemplo:

A planilha:

ESPETO | 58 | vazio | vazio | 42 | 88

Deve virar:

ESPETO | Janeiro | R$ 58
ESPETO | Abril | R$ 42
ESPETO | Maio | R$ 88

Cada valor preenchido representa um lançamento.

Valores vazios devem ser ignorados.

Valores iguais a zero não precisam gerar lançamentos, a menos que sejam necessários para preservar alguma informação da planilha.

22. IMPORTAÇÃO INTELIGENTE

Antes de importar definitivamente:

mostrar uma tela de pré-visualização:

"Encontramos:"

Receitas: X registros
Despesas fixas: X registros
Despesas variáveis: X registros
Comida: X registros
Cachaça: X registros
Cartão: X registros
Outros: X registros
Outras receitas: X registros

Mostrar também:

Total de registros encontrados
Total de receitas
Total de despesas

Depois permitir:

[ CANCELAR ]
[ IMPORTAR DADOS ]

23. EVITAR DUPLICIDADE

Criar mecanismo para evitar duplicação.

Se eu importar a mesma planilha duas vezes, o sistema não deve simplesmente duplicar todos os lançamentos.

Criar um identificador lógico baseado em informações como:

descrição

categoria

mês

ano

valor

tipo

Antes de inserir um registro, verificar se ele já existe.

24. FILTROS

Todo relatório deve permitir filtrar por:

Ano

Mês

Categoria

Subcategoria

Tipo

Forma de pagamento

Cartão

Também criar pesquisa por descrição.

25. GRÁFICOS

Utilizar gráficos modernos e fáceis de interpretar.

Criar:

Gráfico de receitas x despesas

Gráfico de despesas por categoria

Gráfico de evolução mensal

Gráfico de gastos no cartão

Gráfico de comida

Gráfico de outras despesas

Gráfico de saldo acumulado

Os gráficos devem ser atualizados automaticamente conforme os filtros.

26. DESIGN

Quero uma interface moderna, elegante e profissional.

Não quero aparência de planilha Excel.

Quero que pareça um aplicativo financeiro real.

Utilizar:

Sidebar

Cards

Gráficos

Tabelas modernas

Modais

Badges

Filtros

Indicadores financeiros

A aplicação deve ser totalmente responsiva.

Desktop deve ser a experiência principal, mas também funcionar muito bem em celular.

27. CORES E INDICADORES

Utilizar cores de forma semântica:

Receitas → indicador positivo

Despesas → indicador negativo

Saldo positivo → positivo

Saldo negativo → alerta

Valores neutros → cor neutra

Não utilizar excesso de cores.

28. MOEDA

Todo o sistema deve utilizar:

Português do Brasil

BRL

Formato:

R$ 1.250,50

Datas:

DD/MM/YYYY

29. REGRAS FINANCEIRAS

O aplicativo deve calcular automaticamente:

Total de receitas
Total de despesas fixas
Total de despesas variáveis
Total de despesas
Saldo
Total por categoria
Total por mês
Total anual

Fórmula principal:

SALDO = RECEITAS - DESPESAS FIXAS - DESPESAS VARIÁVEIS

30. COMPARAÇÃO COM O MÊS ANTERIOR

No dashboard, mostrar indicadores como:

"↑ 12,5% em relação ao mês anterior"

ou

"↓ 8,2% em relação ao mês anterior"

Aplicar isso para:

Receitas

Despesas

Comida

Cartão

Outras categorias

31. INSIGHTS AUTOMÁTICOS

Criar uma área chamada:

"Resumo financeiro"

Gerar frases automaticamente com base nos dados reais.

Exemplo:

"Você gastou R$ 850,00 com alimentação este mês."

"Seus gastos aumentaram 14% em relação ao mês anterior."

"Cartão representa 31% das suas despesas."

"Seu maior gasto neste mês foi Alimentação."

Não inventar informações.

Todos os insights devem ser calculados com os dados reais.

32. EXPORTAÇÃO

Permitir exportar os dados novamente para:

CSV
XLSX

Criar também opção:

"Exportar relatório"

com os dados filtrados.

33. SEGURANÇA DOS DADOS

Os dados financeiros não devem ser perdidos.

Criar:

Backup

Restauração

Confirmação antes de exclusões

Histórico básico de alterações quando possível

34. NÃO CRIAR FUNCIONALIDADES DESNECESSÁRIAS

Priorizar primeiro:

Importação da planilha

Banco de dados

Dashboard

Lançamentos

Receitas

Despesas

Cartão

Relatórios

Gráficos

Exportação

Não adicionar funcionalidades complexas que não sejam necessárias para o funcionamento principal.

35. ORDEM DE IMPLEMENTAÇÃO

Implementar em etapas.

ETAPA 1:
Analisar e importar os dados da planilha.

ETAPA 2:
Criar banco de dados normalizado.

ETAPA 3:
Criar cadastro e edição de lançamentos.

ETAPA 4:
Criar dashboard.

ETAPA 5:
Criar relatórios.

ETAPA 6:
Criar cartão e parcelamentos.

ETAPA 7:
Criar gráficos e análises.

ETAPA 8:
Criar exportação e backup.

Após cada etapa, garantir que as funcionalidades anteriores continuem funcionando.

36. REGRA FUNDAMENTAL

A planilha CONTROLE FINANCEIRO 2026.xlsx é a referência para a lógica financeira inicial.

Não quero perder a organização que já utilizo.

Porém, o aplicativo NÃO deve simplesmente copiar a estrutura visual da planilha.

Quero:

MINHA LÓGICA FINANCEIRA ATUAL

BANCO DE DADOS ESTRUTURADO

INTERFACE DE APLICATIVO

DASHBOARD

GRÁFICOS

AUTOMAÇÕES

CONTROLE DE CARTÃO E PARCELAS

O resultado deve ser um aplicativo que substitua gradualmente minha planilha, mantendo os mesmos conceitos e permitindo que eu continue controlando minhas finanças de maneira semelhante, porém muito mais rápida e organizada.

Antes de criar o banco de dados definitivo, analise a estrutura real do arquivo enviado e adapte o modelo de dados às informações encontradas.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://excel-to-app-hub.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f724f722-6fd0-4960-a6ae-f9c2850215bd).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
