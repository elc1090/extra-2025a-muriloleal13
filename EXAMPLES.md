# Exemplos de Uso do Sistema

## URLs de Teste com Dados Pré-preenchidos

### 1. Avaliação de Andamento - Ciência da Computação

```
http://localhost:3000/forms/avaliacao_andamento_cc?studentName=João%20Silva&registration=201812345&course=CC&advisor=Prof.%20Maria%20Santos&title=Sistema%20de%20Recomendação%20Baseado%20em%20Machine%20Learning&semester=2025/1&evaluatorName=Prof.%20Carlos%20Oliveira&evaluatorInstitution=UFSM&evaluationDate=2025-01-15
```

### 2. Avaliação Final - Ciência da Computação

```
http://localhost:3000/forms/avaliacao_final_cc?studentName=Ana%20Costa&registration=201923456&course=CC&advisor=Prof.%20Roberto%20Lima&coadvisor=Prof.%20Fernanda%20Souza&title=Desenvolvimento%20de%20Aplicação%20Web%20para%20Gestão%20Acadêmica&semester=2024/2&evaluatorName=Prof.%20Pedro%20Almeida&evaluatorInstitution=UFSM&evaluationDate=2025-01-20
```

### 3. Avaliação Final - Sistemas de Informação

```
http://localhost:3000/forms/avaliacao_final_si?studentName=Lucas%20Pereira&registration=202034567&course=SI&advisor=Prof.%20Juliana%20Martins&title=Sistema%20de%20Controle%20de%20Estoque%20com%20IoT&semester=2024/2&evaluatorName=Prof.%20Ricardo%20Ferreira&evaluatorInstitution=UFSM&evaluationDate=2025-01-25
```

### 4. Ata de Apresentação

```
http://localhost:3000/forms/ata_apresentacao?studentName=Mariana%20Rodrigues&registration=201845678&course=CC&advisor=Prof.%20Eduardo%20Silva&title=Análise%20de%20Sentimentos%20em%20Redes%20Sociais&semester=2024/2&evaluatorName=Prof.%20Amanda%20Torres&evaluatorInstitution=UFSM&evaluationDate=2025-01-30
```

## Como Testar

1. **Acesse a página inicial**: http://localhost:3000
2. **Navegue pelos formulários**: Clique em "Preencher Formulário" para qualquer tipo
3. **Teste o gerador de links**: Clique no ícone de link ao lado de cada formulário
4. **Use as URLs de exemplo**: Copie e cole qualquer URL acima no navegador

## Funcionalidades para Testar

### ✅ Página Inicial
- [x] Layout responsivo
- [x] Cards dos formulários
- [x] Links funcionais
- [x] Seção de funcionalidades

### ✅ Formulários
- [x] Pré-preenchimento via URL
- [x] Validação de campos obrigatórios
- [x] Cálculo automático da nota final
- [x] Tabela de avaliação interativa
- [x] Salvamento local
- [x] Geração de PDF

### ✅ Gerador de Links
- [x] Interface intuitiva
- [x] Geração de URLs
- [x] Funcionalidades de copiar/compartilhar
- [x] Validação de campos

### ✅ Responsividade
- [x] Desktop (1024px+)
- [x] Tablet (768px-1023px)
- [x] Mobile (320px-767px)

## Cenários de Teste

### Cenário 1: Professor criando link para avaliação
1. Acesse o gerador de links
2. Preencha os dados do aluno
3. Gere o link
4. Compartilhe com o avaliador
5. Avaliador acessa o link e encontra dados pré-preenchidos

### Cenário 2: Avaliação completa
1. Acesse um formulário (com ou sem dados pré-preenchidos)
2. Preencha todos os campos obrigatórios
3. Insira notas para todos os critérios
4. Observe o cálculo automático da nota final
5. Adicione observações
6. Gere o PDF

### Cenário 3: Salvamento e recuperação
1. Preencha parcialmente um formulário
2. Clique em "Salvar"
3. Recarregue a página
4. Clique em "Carregar"
5. Verifique se os dados foram restaurados

## Dados de Exemplo para Testes

### Alunos
- **João Silva** - 201812345 - CC - TCC sobre Machine Learning
- **Ana Costa** - 201923456 - CC - TCC sobre Desenvolvimento Web
- **Lucas Pereira** - 202034567 - SI - TCC sobre IoT
- **Mariana Rodrigues** - 201845678 - CC - TCC sobre Análise de Sentimentos

### Professores
- **Prof. Maria Santos** - Orientadora - UFSM
- **Prof. Carlos Oliveira** - Avaliador - UFSM
- **Prof. Roberto Lima** - Orientador - UFSM
- **Prof. Fernanda Souza** - Coorientadora - UFSM

### Notas de Exemplo
Para testar o sistema de avaliação, use estas notas:

**Aprovado (Nota ≥ 6.0):**
- Fundamentação teórica: 8.5
- Metodologia: 7.0
- Desenvolvimento: 8.0
- Cronograma/Conclusões: 7.5
- Apresentação: 8.5

**Reprovado (Nota < 6.0):**
- Fundamentação teórica: 5.0
- Metodologia: 4.5
- Desenvolvimento: 5.5
- Cronograma/Conclusões: 4.0
- Apresentação: 5.0

## Problemas Conhecidos e Soluções

### PDF não gera
- **Causa**: Bloqueador de pop-ups ativo
- **Solução**: Permitir pop-ups para localhost:3000

### Dados não salvam
- **Causa**: localStorage desabilitado
- **Solução**: Verificar configurações de privacidade do navegador

### Layout quebrado no mobile
- **Causa**: Zoom do navegador
- **Solução**: Resetar zoom para 100%

## Melhorias Futuras

- [ ] Integração com banco de dados
- [ ] Sistema de autenticação
- [ ] Histórico de avaliações
- [ ] Notificações por email
- [ ] Assinatura digital
- [ ] Exportação para outros formatos (Word, Excel)
- [ ] Dashboard administrativo
- [ ] Relatórios estatísticos
