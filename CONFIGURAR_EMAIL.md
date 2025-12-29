# Configuração do Formulário de Contato - EmailJS

## Passo a Passo para Configurar o Envio de Emails

### 1. Criar Conta no EmailJS (Gratuito)

1. Acesse: https://www.emailjs.com/
2. Clique em "Sign Up" e crie uma conta gratuita
3. Confirme seu email

### 2. Criar um Serviço de Email

1. No dashboard do EmailJS, vá em **Email Services**
2. Clique em **Add New Service**
3. Escolha seu provedor de email (Gmail, Outlook, etc.)
4. Siga as instruções para conectar sua conta
5. **Anote o Service ID** (exemplo: `service_abc123`)

### 3. Criar um Template de Email

1. Vá em **Email Templates**
2. Clique em **Create New Template**
3. Use este template:

**Subject:**
```
Nova mensagem do portfólio - {{from_name}}
```

**Content:**
```
Você recebeu uma nova mensagem do seu portfólio:

Nome: {{from_name}}
Email: {{from_email}}

Mensagem:
{{message}}

---
Esta mensagem foi enviada através do formulário de contato do seu portfólio.
```

4. **Anote o Template ID** (exemplo: `template_xyz789`)

### 4. Obter a Public Key

1. Vá em **Account** > **General**
2. Copie sua **Public Key** (exemplo: `abcdefghijklmnop`)

### 5. Configurar no Código

Abra o arquivo `script.js` e substitua:

1. **Linha com `YOUR_PUBLIC_KEY`**: Cole sua Public Key do EmailJS
2. **Linha com `YOUR_SERVICE_ID`**: Cole seu Service ID
3. **Linha com `YOUR_TEMPLATE_ID`**: Cole seu Template ID

Exemplo:
```javascript
emailjs.init('sua_public_key_aqui');
// ...
const response = await emailjs.send(
    'service_abc123',  // Seu Service ID
    'template_xyz789', // Seu Template ID
    // ...
);
```

### 6. Testar

1. Abra seu site
2. Preencha o formulário de contato
3. Envie uma mensagem de teste
4. Verifique se recebeu o email em `heryckmota@gmail.com`

## Limites do Plano Gratuito

- 200 emails por mês
- Perfeito para portfólios pessoais

## Alternativa: Formspree

Se preferir uma alternativa mais simples:

1. Acesse: https://formspree.io/
2. Crie uma conta gratuita
3. Crie um novo formulário
4. Substitua o código JavaScript por:

```javascript
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    formData.append('_to', 'heryckmota@gmail.com');
    
    try {
        const response = await fetch('https://formspree.io/f/SEU_FORM_ID', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            showFormMessage('Mensagem enviada com sucesso!', 'success');
            contactForm.reset();
        } else {
            throw new Error('Erro ao enviar');
        }
    } catch (error) {
        showFormMessage('Erro ao enviar mensagem. Tente novamente.', 'error');
    }
});
```

## Suporte

Se tiver problemas, consulte:
- Documentação EmailJS: https://www.emailjs.com/docs/
- Documentação Formspree: https://help.formspree.io/

