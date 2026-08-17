
CREATE TYPE public.tipo_lancamento AS ENUM ('receita','despesa_fixa','despesa_variavel');

CREATE TABLE public.categorias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid DEFAULT auth.uid(),
  nome text NOT NULL,
  tipo public.tipo_lancamento NOT NULL,
  parent_nome text,
  ordem int NOT NULL DEFAULT 0,
  ativo boolean NOT NULL DEFAULT true,
  criado_em timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categorias TO authenticated;
GRANT ALL ON public.categorias TO service_role;
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categorias_select" ON public.categorias FOR SELECT TO authenticated USING (user_id = auth.uid() OR user_id IS NULL);
CREATE POLICY "categorias_insert" ON public.categorias FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "categorias_update" ON public.categorias FOR UPDATE TO authenticated USING (user_id = auth.uid() OR user_id IS NULL) WITH CHECK (user_id = auth.uid() OR user_id IS NULL);
CREATE POLICY "categorias_delete" ON public.categorias FOR DELETE TO authenticated USING (user_id = auth.uid() OR user_id IS NULL);

CREATE TABLE public.cartoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid DEFAULT auth.uid(),
  nome text NOT NULL,
  limite numeric(12,2) NOT NULL DEFAULT 0,
  dia_fechamento int NOT NULL DEFAULT 1,
  dia_vencimento int NOT NULL DEFAULT 10,
  ativo boolean NOT NULL DEFAULT true,
  criado_em timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cartoes TO authenticated;
GRANT ALL ON public.cartoes TO service_role;
ALTER TABLE public.cartoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cartoes_select" ON public.cartoes FOR SELECT TO authenticated USING (user_id = auth.uid() OR user_id IS NULL);
CREATE POLICY "cartoes_insert" ON public.cartoes FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "cartoes_update" ON public.cartoes FOR UPDATE TO authenticated USING (user_id = auth.uid() OR user_id IS NULL) WITH CHECK (user_id = auth.uid() OR user_id IS NULL);
CREATE POLICY "cartoes_delete" ON public.cartoes FOR DELETE TO authenticated USING (user_id = auth.uid() OR user_id IS NULL);

CREATE TABLE public.lancamentos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid DEFAULT auth.uid(),
  descricao text NOT NULL,
  tipo public.tipo_lancamento NOT NULL,
  categoria text NOT NULL,
  subcategoria text,
  valor numeric(12,2) NOT NULL,
  data date NOT NULL,
  mes int NOT NULL CHECK (mes BETWEEN 1 AND 12),
  ano int NOT NULL,
  forma_pagamento text,
  conta text,
  cartao text,
  parcela_atual int,
  total_parcelas int,
  grupo_id uuid,
  observacao text,
  origem text NOT NULL DEFAULT 'manual',
  chave_unica text,
  criado_em timestamptz NOT NULL DEFAULT now(),
  atualizado_em timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.set_lancamento_chave()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.chave_unica := lower(NEW.descricao) || '|' || NEW.categoria || '|' || coalesce(NEW.subcategoria,'') || '|' || NEW.mes::text || '|' || NEW.ano::text || '|' || NEW.valor::text || '|' || NEW.tipo::text;
  NEW.atualizado_em := now();
  RETURN NEW;
END; $$;

CREATE TRIGGER lancamentos_chave BEFORE INSERT OR UPDATE ON public.lancamentos
FOR EACH ROW EXECUTE FUNCTION public.set_lancamento_chave();

CREATE UNIQUE INDEX lancamentos_chave_unica_key ON public.lancamentos (chave_unica);
CREATE INDEX lancamentos_ano_mes_idx ON public.lancamentos (ano, mes);
CREATE INDEX lancamentos_categoria_idx ON public.lancamentos (categoria);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lancamentos TO authenticated;
GRANT ALL ON public.lancamentos TO service_role;
ALTER TABLE public.lancamentos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lancamentos_select" ON public.lancamentos FOR SELECT TO authenticated USING (user_id = auth.uid() OR user_id IS NULL);
CREATE POLICY "lancamentos_insert" ON public.lancamentos FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "lancamentos_update" ON public.lancamentos FOR UPDATE TO authenticated USING (user_id = auth.uid() OR user_id IS NULL) WITH CHECK (user_id = auth.uid() OR user_id IS NULL);
CREATE POLICY "lancamentos_delete" ON public.lancamentos FOR DELETE TO authenticated USING (user_id = auth.uid() OR user_id IS NULL);

CREATE TABLE public.recorrencias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid DEFAULT auth.uid(),
  descricao text NOT NULL,
  tipo public.tipo_lancamento NOT NULL DEFAULT 'despesa_fixa',
  categoria text NOT NULL,
  valor numeric(12,2) NOT NULL,
  periodicidade text NOT NULL DEFAULT 'mensal',
  dia int NOT NULL DEFAULT 5,
  forma_pagamento text,
  cartao text,
  ativo boolean NOT NULL DEFAULT true,
  criado_em timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.recorrencias TO authenticated;
GRANT ALL ON public.recorrencias TO service_role;
ALTER TABLE public.recorrencias ENABLE ROW LEVEL SECURITY;
CREATE POLICY "recorrencias_select" ON public.recorrencias FOR SELECT TO authenticated USING (user_id = auth.uid() OR user_id IS NULL);
CREATE POLICY "recorrencias_insert" ON public.recorrencias FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "recorrencias_update" ON public.recorrencias FOR UPDATE TO authenticated USING (user_id = auth.uid() OR user_id IS NULL) WITH CHECK (user_id = auth.uid() OR user_id IS NULL);
CREATE POLICY "recorrencias_delete" ON public.recorrencias FOR DELETE TO authenticated USING (user_id = auth.uid() OR user_id IS NULL);

INSERT INTO public.cartoes (nome, limite, dia_fechamento, dia_vencimento) VALUES ('Cartão Principal', 5000, 1, 10);

INSERT INTO public.categorias (nome, tipo, ordem) VALUES
('Salário','receita',1),('Informática','receita',2),('Designer','receita',3),('Outras receitas','receita',4),
('Telefone','despesa_fixa',1),('Spotify','despesa_fixa',2),('YouTube Premium','despesa_fixa',3),('Faculdade','despesa_fixa',4),('Plano de Saúde','despesa_fixa',5),
('Comida','despesa_variavel',1),('Cachaça','despesa_variavel',2),('Gasolina Moto','despesa_variavel',3),('Gasolina Carro','despesa_variavel',4),('Cabelo','despesa_variavel',5),('Sobrancelha','despesa_variavel',6),('M','despesa_variavel',7),('Cartão','despesa_variavel',8),('Outros','despesa_variavel',9);

INSERT INTO public.recorrencias (descricao, tipo, categoria, valor, periodicidade, dia, forma_pagamento) VALUES
('TELEFONE','despesa_fixa','Telefone',25,'mensal',5,'Débito automático'),
('SPOTIFY','despesa_fixa','Spotify',6.82,'mensal',5,'Débito automático'),
('YOUTUBE PREMIUM','despesa_fixa','YouTube Premium',8,'mensal',5,'Débito automático'),
('FACULDADE','despesa_fixa','Faculdade',312.12,'mensal',5,'Débito automático'),
('PLANO DE SAÚDE','despesa_fixa','Plano de Saúde',128.98,'mensal',5,'Débito automático');
