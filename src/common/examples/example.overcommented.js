const exampleOvercommented = `

test('getUserInfo returns user information', () => {
    // Teste para verificar se a função getUserInfo() retorna informações de usuário corretamente
    // Chama a função getUserInfo() para obter as informações do usuário
    const userInfo = getUserInfo();
    // Teste sensível à igualdade:
    // Compara o objeto retornado pela função com um objeto esperado usando o método toEqual()
    // Este teste verifica se todas as propriedades do objeto retornado são idênticas às do objeto esperado
    // Verificação
    expect(userInfo).toEqual({
      id: 1, // Verifica se o id é 1
      username: 'john_doe',
      email: 'john@example.com' // Verifica se o email é 'john@example.com'
    });
  });
`;
export default exampleOvercommented;
