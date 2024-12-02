<?php
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
require dirname(__DIR__) . '/vendor/autoload.php';

class Chat implements MessageComponentInterface {
    protected $clients;

    public function __construct() {
        $this->clients = new \SplObjectStorage;
    }

    public function onOpen(ConnectionInterface $conn) {
        $this->clients->attach($conn);
        echo "Nuevo cliente conectado: {$conn->resourceId}\n";
    }

    public function onMessage(ConnectionInterface $from, $msg) {
        echo "Mensaje recibido de {$from->resourceId}: $msg\n";  // Imprime el mensaje recibido
        foreach ($this->clients as $client) {
            if ($from !== $client) {
                $client->send($msg);  // Envía el mensaje a todos los demás clientes
            }
        }
    }

    public function onClose(ConnectionInterface $conn) {
        $this->clients->detach($conn);
        echo "Cliente desconectado: {$conn->resourceId}\n";
    }

    public function onError(ConnectionInterface $conn, \Exception $e) {
        echo "Error: {$e->getMessage()}\n";
        $conn->close();
    }
}

$app = new Ratchet\App('localhost', 8080);
$app->route('/chat', new Chat, ['*']);
echo "Servidor WebSocket corriendo en ws://localhost:8080/chat\n";
$app->run();
