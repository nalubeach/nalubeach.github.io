<?php
header('Content-Type: application/json');
$api_username = '3192426'; // API Username
$api_password = 'I2#-z:205Yvu;iTH#W7l'; // API Password
$data = [
    "method" => "initPayment",
    "api" => [
        "username" => $api_username,
        "password" => $api_password
    ],
    "payment" => [
        "amount" => 1000, // 10,00€ em cêntimos
        "action" => 100,
        "description" => "Pagamento Teste"
    ],
    "order" => [
        "ref" => uniqid("PEDIDO_"),
        "amount" => 1000,
        "taxes" => 0,
        "date" => date("Y-m-d H:i:s"),
        "shipping" => 0
    ],
    "mode" => "SANDBOX", // Altere para "LIVE" quando for produção ou "SANDBOX" para testes
    "returnUrlOk" => "Pagamento_Autorizado.html",
    "returnUrlError" => "https://seusite.com/erro.html",
    "notificationUrl" => "https://seusite.com/notificar.php"
];
$ch = curl_init("https://gateway.reduniq.pt/reduniqpayment/init");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
$response = curl_exec($ch);
curl_close($ch);
$result = json_decode($response, true);
if (isset($result['message']['token'])) {
    echo json_encode(['token' => $result['message']['token']]);
} else {
    echo json_encode(['error' => 'Erro ao gerar token']);
}
?>