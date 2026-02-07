
-- Seed missing frameworks: Story-Lesson-CTA and Authority Breakdown
INSERT INTO public.frameworks (name, category, description, structure, example, is_custom, user_id)
VALUES
  (
    'Story-Lesson-CTA',
    'storytelling',
    'Narrativa pessoal seguida de lição prática e chamada para ação',
    ARRAY[
      'Conte uma história pessoal ou de cliente com contexto real',
      'Extraia a lição ou princípio universal da história',
      'Conecte a lição a um benefício claro para o leitor',
      'Finalize com CTA direto e acionável'
    ],
    'Há 3 anos cometi o pior erro da minha carreira. Aprendi que velocidade sem direção é desperdício. Se você sente que está correndo sem sair do lugar, comece por definir suas 3 prioridades. Me conta: qual é sua prioridade #1 hoje?',
    false,
    NULL
  ),
  (
    'Authority Breakdown',
    'authority',
    'Desconstrução de conceito complexo para demonstrar domínio e autoridade',
    ARRAY[
      'Apresente o conceito ou mito que será desconstruído',
      'Quebre em partes simples com evidências ou dados',
      'Ofereça um insight original que só um especialista teria',
      'Feche com recomendação prática e posicionamento de autoridade'
    ],
    'Todo mundo fala em "product-market fit" mas poucos entendem o que realmente significa. Não é sobre ter muitos clientes. É sobre ter clientes que chorariam se seu produto sumisse. Aqui está o teste que uso para medir isso em 5 minutos.',
    false,
    NULL
  );
