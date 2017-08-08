<?php

$aMethod = isset($_REQUEST['method']) ? $_REQUEST['method'] : '';
$aId = isset($_REQUEST['id']) ? $_REQUEST['id'] : '';
$aReturn = array('success' => true, 'method' => $aMethod, 'time' => time());

try {
	if($aId == '') {
		throw new Exception('Empty id');
	}

	switch ($aMethod) {
		case 'create':
			$aReturn['data'] = 'Test';
			break;
		case 'read':
			$aReturn['data'] = array(
				'slide' => 2,
				'write_time' => time()
			);
			break;
		case 'write':
			$aReturn['slide'] = 'Test';
			break;
		default:
			$aReturn = array('failure' => true, 'message' => 'Unknow method');
			break;
	}
} catch(Exception $e) {
	$aReturn = array('failure' => true, 'message' => $e->getMessage());
}

header('Content-Type: application/json');
echo json_encode($aReturn, JSON_NUMERIC_CHECK);

?>
