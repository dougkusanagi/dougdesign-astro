---
title: "React 19: Como Usar as Novas Actions e o hook useActionState"
slug: react-19
pubDate: 2026-07-14T18:00:00-03:00
updatedDate: 2026-07-14T21:09:39.197Z
author: Lila Dev
category: Programacao
draft: false
scheduled: false
meta_description: Guia prático sobre o React 19, apresentando o uso de Actions,
  useActionState, useFormStatus e exemplos de código reais para formulários
  modernos.
description: Descubra como o React 19 simplifica o gerenciamento de estados
  assíncronos e submissões de formulários com Actions e novos hooks nativos.
image: ../../assets/images/posts/react-19.png
readingTime: 6 min
featured_image:
  prompt: High quality premium aesthetic clean vector illustration, abstract
    glowing React atomic icon, dark blue and purple programmer interface
    background, no text, no logos, 16:9 ratio
  alt: React atomic icon illustration
keyword_principal: React 19
content_type: guia
cluster: programacao
assunto: React 19
intencao_busca: principais mudancas e como migrar projetos
decisao_do_leitor: decidir
fato_novo: React 19
canonical_role: principal
internal_links:
  to: []
  from_needed: []
canibalizacao:
  status: validado
  resumo: Validado localmente sem conflitos de intenção.
fontes_oficiais:
  - https://react.dev
---

O React 19 trouxe um salto qualitativo na forma como lidamos com interações assíncronas e formulários. A grande mudança gira em torno do conceito de **Actions**, que simplificam o gerenciamento de estados de carregamento, erros e feedback visual diretamente nas funções de submissão de dados.

Neste guia prático, vamos analisar como as antigas práticas de gerenciamento de formulários mudaram e como implementar a nova API de formulários usando o hook `useActionState` (anteriormente conhecido como `useFormState` nas versões de teste).

## O que são Actions no React 19?

Tradicionalmente, ao submeter um formulário ou disparar uma chamada de API assíncrona após um clique, você precisava gerenciar manualmente o estado de carregamento (`pending`), o estado de sucesso e possíveis erros de forma explícita na sua árvore de estados.

```tsx
// O jeito antigo (React 18)
const [isPending, setIsPending] = useState(false);
const [error, setError] = useState(null);

async function handleSubmit() {
  setIsPending(true);
  try {
    await updateProfileName(name);
  } catch (err) {
    setError(err);
  } finally {
    setIsPending(false);
  }
}
```

Com o React 19, se uma função passada a um elemento de formulário for assíncrona, o React gerencia automaticamente o ciclo de transição e o estado pendente. Isso é o que chamamos de **Action**.

## O Novo Hook `useActionState`

O `useActionState` simplifica ainda mais esse processo. Ele aceita uma função action e retorna o estado atualizado do formulário, a nova action para passar no atributo `action` do formulário, e um booleano que indica se a ação está pendente.

### Exemplo Prático: Atualizando Perfil

Abaixo, veja como implementar um formulário moderno usando `useActionState`:

```tsx
import { useActionState } from 'react';

// Função assíncrona que simula o salvamento
async function updateProfile(prevState: any, formData: FormData) {
  const name = formData.get("username") as string;
  try {
    const response = await fetch('/api/profile', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
    if (!response.ok) throw new Error("Erro ao salvar dados");
    return { success: true, message: "Perfil atualizado!" };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export function ProfileForm() {
  const [state, formAction, isPending] = useActionState(updateProfile, {
    success: null,
    message: ""
  });

  return (
    <form action={formAction} className="flex flex-col gap-4 max-w-sm">
      <label htmlFor="username" className="text-sm font-medium">Nome do Usuário</label>
      <input 
        id="username"
        name="username"
        type="text" 
        required 
        disabled={isPending}
        className="border p-2 rounded"
      />
      
      <button 
        type="submit" 
        disabled={isPending}
        className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isPending ? 'Salvando...' : 'Salvar Alterações'}
      </button>

      {state.message && (
        <p className={state.success ? "text-green-600" : "text-red-600"}>
          {state.message}
        </p>
      )}
    </form>
  );
}
```

## Benefícios da Nova Abordagem

1. **Adeus ao Boilerplate:** Não há necessidade de criar múltiplos `useState` para controlar erros e carregamentos.
2. **Suporte Nativo a FormData:** O React 19 integra-se nativamente com a API `FormData` do navegador, eliminando o mapeamento manual de campos.
3. **Melhoria no Progressive Enhancement:** Formulários funcionam de maneira robusta mesmo antes do JavaScript da aplicação terminar de carregar completamente.

## Conclusão e Próximos Passos

Se você está começando um novo projeto ou atualizando um existente, adotar as **Actions** e o `useActionState` é o melhor caminho para manter o código limpo, testável e de alta performance. Certifique-se de testar seus fluxos de tratamento de erros, pois o React 19 agora relata automaticamente erros não tratados nas transições de estado de forma muito mais inteligente.
