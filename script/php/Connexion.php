<?php

class Connexion {
	private $host = '';
	private $login = '';
	private $pass = '';
	private $database = '';
	private $db;

	private function connect()
	{
		require('config/config.php');
		foreach ($DataDb as $try)
		{
			$this->host = $try['DB_HOST'];
			$this->login = $try['DB_LOGIN'];
			$this->pass = $try['DB_PASS'];
			$this->database = $try['DB_BASE'];
			try{
				$this->db = new PDO(
					'mysql:host='.$this->host.';dbname='.$this->database.';charset=utf8mb4', 
					$this->login, 
					$this->pass,
					array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES UTF8')
				);
				$this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
				$this->db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
			break;
				// $this->db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_OBJ);
			}catch (PDOException $e)
			{
				$msg = 'ERREUR PDO dans ' . $e->getFile() . ' L.' . $e->getLine() . ' : ' . $e->getMessage();
				die($msg);
			}
		}
		return $this->db;
	}

	public function createQuery($sql, $parameters = null)
    {
        if ($parameters) {
            $result = $this->checkConnect()->prepare($sql);
			$result->execute($parameters);
            return $result;
        }
		$result = $this->checkConnect()->query($sql);
        return $result;
	}
	
	public function lastId()
	{
		$ID = $this->checkConnect()->lastInsertId();
		return $ID;
	}

	private function checkConnect()
    {
    //Vérifie si la connexion est nulle et fait appel à getConnection()
        if ($this->db === null) {
            return $this->connect();
        }
        //Si la connexion existe, elle est renvoyée, inutile de refaire une connexion
        return $this->db;
    }
}
?>