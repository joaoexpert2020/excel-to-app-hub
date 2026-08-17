-- Seed: dados importados da planilha CONTROLE FINANCEIRO 2026.xlsx (valores, nunca formulas)
INSERT INTO public.lancamentos (descricao,tipo,categoria,subcategoria,valor,data,mes,ano,forma_pagamento,cartao,parcela_atual,total_parcelas,origem)
SELECT p[1],
  (CASE p[2] WHEN 'R' THEN 'receita' WHEN 'F' THEN 'despesa_fixa' ELSE 'despesa_variavel' END)::public.tipo_lancamento,
  p[3], nullif(p[4],''), p[5]::numeric,
  make_date(2026, p[6]::int, p[7]::int), p[6]::int, 2026,
  (CASE p[8] WHEN 'C' THEN 'Conta' WHEN 'D' THEN 'Débito automático' WHEN 'K' THEN 'Cartão de crédito' ELSE 'Dinheiro' END),
  nullif(p[9],''), nullif(p[10],'')::int, nullif(p[11],'')::int, 'planilha'
FROM (
  SELECT string_to_array(linha,'|') AS p
  FROM unnest(string_to_array($seed$
SALÁRIO|R|Salário||3420|1|05|C|||
SALÁRIO|R|Salário||3420|2|05|C|||
SALÁRIO|R|Salário||3420|3|05|C|||
SALÁRIO|R|Salário||3500|4|05|C|||
SALÁRIO|R|Salário||3500|5|05|C|||
SALÁRIO|R|Salário||3650|6|05|C|||
SALÁRIO|R|Salário||3650|7|05|C|||
SALÁRIO|R|Salário||3650|8|05|C|||
SALÁRIO|R|Salário||3650|9|05|C|||
SALÁRIO|R|Salário||3650|10|05|C|||
SALÁRIO|R|Salário||3650|11|05|C|||
SALÁRIO|R|Salário||3650|12|05|C|||
INFORMÁTICA|R|Informática||60|1|05|C|||
INFORMÁTICA|R|Informática||40|4|05|C|||
INFORMÁTICA|R|Informática||20|5|05|C|||
INFORMÁTICA|R|Informática||170|6|05|C|||
INFORMÁTICA|R|Informática||230|7|05|C|||
INFORMÁTICA|R|Informática||40|8|05|C|||
TELEFONE|F|Telefone||25|1|05|D|||
TELEFONE|F|Telefone||25|2|05|D|||
TELEFONE|F|Telefone||25|3|05|D|||
TELEFONE|F|Telefone||25|4|05|D|||
TELEFONE|F|Telefone||25|5|05|D|||
TELEFONE|F|Telefone||25|6|05|D|||
TELEFONE|F|Telefone||25|7|05|D|||
TELEFONE|F|Telefone||25|8|05|D|||
TELEFONE|F|Telefone||25|9|05|D|||
TELEFONE|F|Telefone||25|10|05|D|||
TELEFONE|F|Telefone||25|11|05|D|||
TELEFONE|F|Telefone||25|12|05|D|||
SPOTIFY|F|Spotify||6.82|1|05|D|||
SPOTIFY|F|Spotify||6.82|2|05|D|||
SPOTIFY|F|Spotify||6.82|3|05|D|||
SPOTIFY|F|Spotify||6.82|4|05|D|||
SPOTIFY|F|Spotify||6.82|5|05|D|||
SPOTIFY|F|Spotify||6.82|6|05|D|||
SPOTIFY|F|Spotify||6.82|7|05|D|||
SPOTIFY|F|Spotify||6.82|8|05|D|||
SPOTIFY|F|Spotify||6.82|9|05|D|||
SPOTIFY|F|Spotify||6.82|10|05|D|||
SPOTIFY|F|Spotify||6.82|11|05|D|||
SPOTIFY|F|Spotify||6.82|12|05|D|||
YOUTUBE PREMIUM|F|YouTube Premium||8|1|05|D|||
YOUTUBE PREMIUM|F|YouTube Premium||8|2|05|D|||
YOUTUBE PREMIUM|F|YouTube Premium||8|3|05|D|||
YOUTUBE PREMIUM|F|YouTube Premium||8|4|05|D|||
YOUTUBE PREMIUM|F|YouTube Premium||8|5|05|D|||
YOUTUBE PREMIUM|F|YouTube Premium||8|6|05|D|||
YOUTUBE PREMIUM|F|YouTube Premium||8|7|05|D|||
YOUTUBE PREMIUM|F|YouTube Premium||8|8|05|D|||
YOUTUBE PREMIUM|F|YouTube Premium||8|9|05|D|||
YOUTUBE PREMIUM|F|YouTube Premium||8|10|05|D|||
YOUTUBE PREMIUM|F|YouTube Premium||8|11|05|D|||
YOUTUBE PREMIUM|F|YouTube Premium||8|12|05|D|||
FACULDADE|F|Faculdade||312.12|1|05|D|||
FACULDADE|F|Faculdade||312.12|2|05|D|||
FACULDADE|F|Faculdade||312.12|3|05|D|||
FACULDADE|F|Faculdade||312.12|4|05|D|||
FACULDADE|F|Faculdade||312.12|5|05|D|||
FACULDADE|F|Faculdade||312.12|6|05|D|||
FACULDADE|F|Faculdade||312.12|7|05|D|||
FACULDADE|F|Faculdade||312.12|8|05|D|||
FACULDADE|F|Faculdade||312.12|9|05|D|||
FACULDADE|F|Faculdade||312.12|10|05|D|||
FACULDADE|F|Faculdade||312.12|11|05|D|||
FACULDADE|F|Faculdade||312.12|12|05|D|||
PLANO DE SAÚDE|F|Plano de Saúde||128.98|1|05|D|||
PLANO DE SAÚDE|F|Plano de Saúde||128.98|2|05|D|||
PLANO DE SAÚDE|F|Plano de Saúde||128.98|3|05|D|||
PLANO DE SAÚDE|F|Plano de Saúde||128.98|4|05|D|||
PLANO DE SAÚDE|F|Plano de Saúde||128.98|5|05|D|||
PLANO DE SAÚDE|F|Plano de Saúde||128.98|6|05|D|||
PLANO DE SAÚDE|F|Plano de Saúde||128.98|7|05|D|||
PLANO DE SAÚDE|F|Plano de Saúde||128.98|8|05|D|||
PLANO DE SAÚDE|F|Plano de Saúde||128.98|9|05|D|||
PLANO DE SAÚDE|F|Plano de Saúde||128.98|10|05|D|||
PLANO DE SAÚDE|F|Plano de Saúde||128.98|11|05|D|||
PLANO DE SAÚDE|F|Plano de Saúde||128.98|12|05|D|||
GASOLINA MOTO|V|Gasolina Moto||100|1|15|$|||
GASOLINA MOTO|V|Gasolina Moto||20|2|15|$|||
GASOLINA MOTO|V|Gasolina Moto||160|3|15|$|||
GASOLINA MOTO|V|Gasolina Moto||80|4|15|$|||
GASOLINA MOTO|V|Gasolina Moto||120|5|15|$|||
GASOLINA MOTO|V|Gasolina Moto||90|6|15|$|||
GASOLINA MOTO|V|Gasolina Moto||90|7|15|$|||
GASOLINA MOTO|V|Gasolina Moto||60|8|15|$|||
GASOLINA CARRO|V|Gasolina Carro||100|1|15|$|||
GASOLINA CARRO|V|Gasolina Carro||30|2|15|$|||
GASOLINA CARRO|V|Gasolina Carro||50|3|15|$|||
GASOLINA CARRO|V|Gasolina Carro||160|4|15|$|||
GASOLINA CARRO|V|Gasolina Carro||100|5|15|$|||
GASOLINA CARRO|V|Gasolina Carro||100|6|15|$|||
GASOLINA CARRO|V|Gasolina Carro||250|7|15|$|||
GASOLINA CARRO|V|Gasolina Carro||100|8|15|$|||
CABELO|V|Cabelo||50|5|15|$|||
CABELO|V|Cabelo||50|7|15|$|||
SOBRANCELHA|V|Sobrancelha||50|1|15|$|||
SOBRANCELHA|V|Sobrancelha||50|4|15|$|||
SOBRANCELHA|V|Sobrancelha||50|6|15|$|||
SOBRANCELHA|V|Sobrancelha||100|7|15|$|||
M|V|M||225|2|15|$|||
M|V|M||60|3|15|$|||
M|V|M||130|4|15|$|||
M|V|M||320|5|15|$|||
M|V|M||185|6|15|$|||
M|V|M||240|7|15|$|||
ESPETO|V|Comida|ESPETO|58|1|15|$|||
ESPETO|V|Comida|ESPETO|42|4|15|$|||
ESPETO|V|Comida|ESPETO|88|5|15|$|||
ESPETO|V|Comida|ESPETO|123|6|15|$|||
ESPETO|V|Comida|ESPETO|57|7|15|$|||
PIZZA|V|Comida|PIZZA|130.15|1|15|$|||
PIZZA|V|Comida|PIZZA|70|3|15|$|||
PIZZA|V|Comida|PIZZA|15|4|15|$|||
PIZZA|V|Comida|PIZZA|122|7|15|$|||
PEIXE|V|Comida|PEIXE|76|6|15|$|||
PEIXE|V|Comida|PEIXE|60|7|15|$|||
SORVETE|V|Comida|SORVETE|63.58|1|15|$|||
SORVETE|V|Comida|SORVETE|86|2|15|$|||
SORVETE|V|Comida|SORVETE|29.5|3|15|$|||
SORVETE|V|Comida|SORVETE|5|5|15|$|||
SORVETE|V|Comida|SORVETE|56.78|6|15|$|||
SORVETE|V|Comida|SORVETE|34.39|7|15|$|||
SORVETE|V|Comida|SORVETE|12|8|15|$|||
PÃO C/ MOR.|V|Comida|PÃO C/ MOR.|1.63|1|15|$|||
PÃO C/ MOR.|V|Comida|PÃO C/ MOR.|6.65|2|15|$|||
PÃO C/ MOR.|V|Comida|PÃO C/ MOR.|8.91|3|15|$|||
PÃO C/ MOR.|V|Comida|PÃO C/ MOR.|1.8|5|15|$|||
CHURROS|V|Comida|CHURROS|37|1|15|$|||
CHURROS|V|Comida|CHURROS|20|2|15|$|||
CHURROS|V|Comida|CHURROS|25|3|15|$|||
CHURROS|V|Comida|CHURROS|50|6|15|$|||
SALGADO|V|Comida|SALGADO|10.8|1|15|$|||
SALGADO|V|Comida|SALGADO|27|3|15|$|||
SALGADO|V|Comida|SALGADO|30|5|15|$|||
SALGADO|V|Comida|SALGADO|3.17|6|15|$|||
SALGADO|V|Comida|SALGADO|10|7|15|$|||
SALGADO|V|Comida|SALGADO|44|8|15|$|||
LANCHE|V|Comida|LANCHE|18|1|15|$|||
LANCHE|V|Comida|LANCHE|36|5|15|$|||
CAROL|V|Comida|CAROL|40|1|15|$|||
CAROL|V|Comida|CAROL|10|2|15|$|||
CAROL|V|Comida|CAROL|71|3|15|$|||
CAROL|V|Comida|CAROL|30.5|4|15|$|||
CAROL|V|Comida|CAROL|40.49|5|15|$|||
CAROL|V|Comida|CAROL|10|6|15|$|||
CAROL|V|Comida|CAROL|20|7|15|$|||
CAROL|V|Comida|CAROL|17.5|8|15|$|||
TRUFA|V|Comida|TRUFA|23|2|15|$|||
HOT DOG|V|Comida|HOT DOG|20|2|15|$|||
HOT DOG|V|Comida|HOT DOG|31|4|15|$|||
HOT DOG|V|Comida|HOT DOG|32|6|15|$|||
HOT DOG|V|Comida|HOT DOG|35|7|15|$|||
SUCO|V|Comida|SUCO|9|2|15|$|||
MC DONALD|V|Comida|MC DONALD|99.5|3|15|$|||
FINI|V|Comida|FINI|22.26|3|15|$|||
ÁGUA|V|Comida|ÁGUA|1.59|3|15|$|||
SALSICHA|V|Comida|SALSICHA|9|3|15|$|||
SALSICHA|V|Comida|SALSICHA|17|6|15|$|||
OVO DE PASCOA|V|Comida|OVO DE PASCOA|288|4|15|$|||
COCA COLA|V|Comida|COCA COLA|10|4|15|$|||
FINAL DE SEMANA|V|Comida|FINAL DE SEMANA|72|4|15|$|||
FINAL DE SEMANA|V|Comida|FINAL DE SEMANA|30.86|7|15|$|||
MERCADO|V|Comida|MERCADO|79.77|4|15|$|||
CHURRASCO|V|Comida|CHURRASCO|20.1|5|15|$|||
PASTEL|V|Comida|PASTEL|38|6|15|$|||
CAFÉ DA MANHÃ|V|Comida|CAFÉ DA MANHÃ|5.19|7|15|$|||
BOLACHA|V|Comida|BOLACHA|3|7|15|$|||
ESPETO DO DIEGO|V|Comida|ESPETO DO DIEGO|40|7|15|$|||
ESPETO DO DIEGO|V|Comida|ESPETO DO DIEGO|100|8|15|$|||
BEACH TENNIS|V|Comida|BEACH TENNIS|42|1|15|$|||
BEACH TENNIS|V|Comida|BEACH TENNIS|265|2|15|$|||
BEACH TENNIS|V|Comida|BEACH TENNIS|122|3|15|$|||
BEACH TENNIS|V|Comida|BEACH TENNIS|47|4|15|$|||
QUERO MAIS|V|Comida|QUERO MAIS|79.99|2|15|$|||
QUERO MAIS|V|Comida|QUERO MAIS|103.99|7|15|$|||
DOCE MANIA|V|Comida|DOCE MANIA|30|5|15|$|||
DOCE MANIA|V|Comida|DOCE MANIA|42|7|15|$|||
PAVE|V|Comida|PAVE|10.6|8|15|$|||
CHOCOLATE|V|Comida|CHOCOLATE|30|8|15|$|||
CERVEJA BOA|V|Cachaça|CERVEJA BOA|181.05|1|15|$|||
CERVEJA BOA|V|Cachaça|CERVEJA BOA|142.2|2|15|$|||
CERVEJA BOA|V|Cachaça|CERVEJA BOA|130|3|15|$|||
CERVEJA BOA|V|Cachaça|CERVEJA BOA|166.68|4|15|$|||
CERVEJA BOA|V|Cachaça|CERVEJA BOA|66|5|15|$|||
CERVEJA BOA|V|Cachaça|CERVEJA BOA|172|6|15|$|||
CERVEJA BOA|V|Cachaça|CERVEJA BOA|89|7|15|$|||
CERVEJA BOA|V|Cachaça|CERVEJA BOA|58|8|15|$|||
HEINEKEN|V|Cachaça|HEINEKEN|21|4|15|$|||
ICE|V|Cachaça|ICE|8|1|15|$|||
JACK APPLE|V|Cachaça|JACK APPLE|55.93|2|15|$|||
JACK APPLE|V|Cachaça|JACK APPLE|150|8|15|$|||
CERVEJA (PAI)|V|Cachaça|CERVEJA (PAI)|18|2|15|$|||
DRINK|V|Cachaça|DRINK|18|3|15|$|||
DRINK|V|Cachaça|DRINK|30|5|15|$|||
DRINK|V|Cachaça|DRINK|79|7|15|$|||
GELO|V|Cachaça|GELO|30|3|15|$|||
ENERGÉTICO|V|Cachaça|ENERGÉTICO|5|3|15|$|||
ENERGÉTICO|V|Cachaça|ENERGÉTICO|8|4|15|$|||
ENERGÉTICO|V|Cachaça|ENERGÉTICO|47.9|8|15|$|||
MANSÃO|V|Cachaça|MANSÃO|47|4|15|$|||
MANSÃO|V|Cachaça|MANSÃO|42|5|15|$|||
MANSÃO|V|Cachaça|MANSÃO|18|6|15|$|||
MANSÃO|V|Cachaça|MANSÃO|15|7|15|$|||
FICHA SINUCA|V|Outros|FICHA SINUCA|12|1|15|$|||
FICHA SINUCA|V|Outros|FICHA SINUCA|16|2|15|$|||
FICHA SINUCA|V|Outros|FICHA SINUCA|10|3|15|$|||
FICHA SINUCA|V|Outros|FICHA SINUCA|7.5|5|15|$|||
FICHA SINUCA|V|Outros|FICHA SINUCA|25|6|15|$|||
FICHA SINUCA|V|Outros|FICHA SINUCA|12.5|7|15|$|||
FICHA SINUCA|V|Outros|FICHA SINUCA|7.5|8|15|$|||
SEDA|V|Outros|SEDA|11.5|1|15|$|||
SEDA|V|Outros|SEDA|5|2|15|$|||
SEDA|V|Outros|SEDA|3.5|3|15|$|||
SEDA|V|Outros|SEDA|4|4|15|$|||
SEDA|V|Outros|SEDA|4|5|15|$|||
SEDA|V|Outros|SEDA|8|6|15|$|||
TECLADO AJAZZ|V|Outros|TECLADO AJAZZ|343.19|1|15|$|||
PARK PEREIRA|V|Outros|PARK PEREIRA|210|1|15|$|||
PARK PEREIRA|V|Outros|PARK PEREIRA|56|5|15|$|||
CHICLETE|V|Outros|CHICLETE|21|1|15|$|||
CHICLETE|V|Outros|CHICLETE|10.75|2|15|$|||
CHICLETE|V|Outros|CHICLETE|13.5|3|15|$|||
CHICLETE|V|Outros|CHICLETE|10.5|4|15|$|||
CHICLETE|V|Outros|CHICLETE|10.5|5|15|$|||
CACHOEIRA DOM.|V|Outros|CACHOEIRA DOM.|200.04|1|15|$|||
JBL|V|Outros|JBL|1550|1|15|$|||
LISTERINE|V|Outros|LISTERINE|23.2|2|15|$|||
DOC MOTO|V|Outros|DOC MOTO|507.56|2|15|$|||
BOMBA DE AR (PAI)|V|Outros|BOMBA DE AR (PAI)|162|2|15|$|||
DOC CARRO|V|Outros|DOC CARRO|2746|2|15|$|||
PIRULITO|V|Outros|PIRULITO|3|2|15|$|||
MANGUITO E CETIM|V|Outros|MANGUITO E CETIM|36.9|3|15|$|||
PRESENTE CAROL|V|Outros|PRESENTE CAROL|48.98|3|15|$|||
PRESENTE CAROL|V|Outros|PRESENTE CAROL|59.8|5|15|$|||
PRESENTE CAROL|V|Outros|PRESENTE CAROL|71|6|15|$|||
PEÇAS MOTO|V|Outros|PEÇAS MOTO|236.86|3|15|$|||
PEÇAS MOTO|V|Outros|PEÇAS MOTO|215.94|4|15|$|||
FERNANDOPOLIS|V|Outros|FERNANDOPOLIS|10|3|15|$|||
REMÉDIO|V|Outros|REMÉDIO|10|3|15|$|||
REMÉDIO|V|Outros|REMÉDIO|10|5|15|$|||
REMÉDIO|V|Outros|REMÉDIO|32|6|15|$|||
RODEIO|V|Outros|RODEIO|148|4|15|$|||
RADIOGRAFIA|V|Outros|RADIOGRAFIA|90|4|15|$|||
CAMISINHA|V|Outros|CAMISINHA|13.8|5|15|$|||
ORGANIZAR ESTUDIO|V|Outros|ORGANIZAR ESTUDIO|111.8|5|15|$|||
PRESENTE MAE|V|Outros|PRESENTE MAE|127.37|5|15|$|||
DENTISTA|V|Outros|DENTISTA|950|5|15|$|||
CELULAR CAROL|V|Outros|CELULAR CAROL|3900|5|15|$|||
TROCA DE OLEO MOTO|V|Outros|TROCA DE OLEO MOTO|90|5|15|$|||
PLANTINHAS E LIMPA PRATA|V|Outros|PLANTINHAS E LIMPA PRATA|36.09|5|15|$|||
TENIS|V|Outros|TENIS|45.5|5|15|$|||
PEITA DO BRASIL|V|Outros|PEITA DO BRASIL|268|6|15|$|||
EMPRESTIMO PAI|V|Outros|EMPRESTIMO PAI|20000|6|15|$|||
IMPRESSÃO ADESIVO|V|Outros|IMPRESSÃO ADESIVO|16|6|15|$|||
PLACA ACÚSTICA|V|Outros|PLACA ACÚSTICA|489.22|6|15|$|||
CUBO MÁGICO E CINTO|V|Outros|CUBO MÁGICO E CINTO|21.7|6|15|$|||
GTA|V|Outros|GTA|348.67|8|15|$|||
PRESENTE ARTHUR|V|Outros|PRESENTE ARTHUR|50|6|15|$|||
ESPELHO|V|Outros|ESPELHO|15|6|15|$|||
EXCURSÃO AWE|V|Outros|EXCURSÃO AWE|180|7|15|$|||
LIMPEZA AR|V|Outros|LIMPEZA AR|250|7|15|$|||
MEIA NIKE|V|Outros|MEIA NIKE|29.98|7|15|$|||
CABO USB B|V|Outros|CABO USB B|15.45|7|15|$|||
PARAFUSOS|V|Outros|PARAFUSOS|10|7|15|$|||
SACO DE PANCADA|V|Outros|SACO DE PANCADA|80|7|15|$|||
MEIA NIKE BRANCA|V|Outros|MEIA NIKE BRANCA|78.38|7|15|$|||
PRESENTE PAI|V|Outros|PRESENTE PAI|103|8|15|$|||
ANEL CAROL|V|Cartão|ANEL CAROL|58.04|2|10|K|Cartão Principal|1|3
ANEL CAROL|V|Cartão|ANEL CAROL|58.04|3|10|K|Cartão Principal|2|3
ANEL CAROL|V|Cartão|ANEL CAROL|58.04|4|10|K|Cartão Principal|3|3
BOLSA ARTHUR(INTER)|V|Cartão|BOLSA ARTHUR(INTER)|203|3|10|K|Cartão Principal||
PSN (MP)|V|Cartão|PSN (MP)|68.21|3|10|K|Cartão Principal|1|10
PSN (MP)|V|Cartão|PSN (MP)|68.21|4|10|K|Cartão Principal|2|10
PSN (MP)|V|Cartão|PSN (MP)|68.21|5|10|K|Cartão Principal|3|10
PSN (MP)|V|Cartão|PSN (MP)|68.21|6|10|K|Cartão Principal|4|10
PSN (MP)|V|Cartão|PSN (MP)|65.9|7|10|K|Cartão Principal|5|10
PSN (MP)|V|Cartão|PSN (MP)|65.9|8|10|K|Cartão Principal|6|10
PSN (MP)|V|Cartão|PSN (MP)|65.9|9|10|K|Cartão Principal|7|10
PSN (MP)|V|Cartão|PSN (MP)|65.9|10|10|K|Cartão Principal|8|10
PSN (MP)|V|Cartão|PSN (MP)|65.9|11|10|K|Cartão Principal|9|10
PSN (MP)|V|Cartão|PSN (MP)|65.9|12|10|K|Cartão Principal|10|10
GASOLINA MOTO|V|Cartão|GASOLINA MOTO|100|3|10|K|Cartão Principal|1|2
GASOLINA MOTO|V|Cartão|GASOLINA MOTO|50|4|10|K|Cartão Principal|2|2
CONTROLE PS5|V|Cartão|CONTROLE PS5|55.36|6|10|K|Cartão Principal|1|6
CONTROLE PS5|V|Cartão|CONTROLE PS5|55.36|7|10|K|Cartão Principal|2|6
CONTROLE PS5|V|Cartão|CONTROLE PS5|55.36|8|10|K|Cartão Principal|3|6
CONTROLE PS5|V|Cartão|CONTROLE PS5|55.36|9|10|K|Cartão Principal|4|6
CONTROLE PS5|V|Cartão|CONTROLE PS5|55.36|10|10|K|Cartão Principal|5|6
CONTROLE PS5|V|Cartão|CONTROLE PS5|55.36|11|10|K|Cartão Principal|6|6
CALÇA MOLETOM|V|Cartão|CALÇA MOLETOM|52.43|7|10|K|Cartão Principal|1|2
CALÇA MOLETOM|V|Cartão|CALÇA MOLETOM|40.14|8|10|K|Cartão Principal|2|2
FRETE PLACA ACUSTICA|V|Cartão|FRETE PLACA ACUSTICA|137.89|7|10|K|Cartão Principal||
BARRA FIXA|V|Cartão|BARRA FIXA|29.45|8|10|K|Cartão Principal|1|2
BARRA FIXA|V|Cartão|BARRA FIXA|29.45|9|10|K|Cartão Principal|2|2
POP FILTER|V|Cartão|POP FILTER|61.19|8|10|K|Cartão Principal||
ADAPTADOR E PORTA BECK|V|Cartão|ADAPTADOR E PORTA BECK|30.61|9|10|K|Cartão Principal||
ROUPA RENNER|V|Cartão|ROUPA RENNER|47.9|9|10|K|Cartão Principal|1|2
ROUPA RENNER|V|Cartão|ROUPA RENNER|47.9|10|10|K|Cartão Principal|2|2
BOLSA ARTHUR|R|Outras receitas|BOLSA ARTHUR|250.98|1|15|C|||
BOLSA ARTHUR|R|Outras receitas|BOLSA ARTHUR|360|2|15|C|||
BOLSA ARTHUR|R|Outras receitas|BOLSA ARTHUR|100|3|15|C|||
DIÁRIA EXP|R|Outras receitas|DIÁRIA EXP|300|3|15|C|||
DIÁRIA EXP|R|Outras receitas|DIÁRIA EXP|100|5|15|C|||
PLANTÃO|R|Outras receitas|PLANTÃO|100|3|15|C|||
PLANTÃO|R|Outras receitas|PLANTÃO|180|6|15|C|||
PLANTÃO|R|Outras receitas|PLANTÃO|50|8|15|C|||
CASHBACK|R|Outras receitas|CASHBACK|46.07|5|15|C|||
GASOLINA ANA|R|Outras receitas|GASOLINA ANA|20|6|15|C|||
SAQUE NIVER|R|Outras receitas|SAQUE NIVER|1866.43|7|15|C|||
DRUM KIT|R|Outras receitas|DRUM KIT|281|8|15|C|||
EMPRESTEI MOTO|R|Outras receitas|EMPRESTEI MOTO|50|8|15|C|||
PORTA BECK|R|Outras receitas|PORTA BECK|10|8|15|C|||
$seed$, E'\n')) AS linha
  WHERE btrim(linha) <> ''
) t
ON CONFLICT (chave_unica) DO NOTHING;
