<?php
require_once "config.php";
header('Content-Type: application/json; charset=utf-8');
$valido = array('success' => false, 'mensaje' => "");
$cx = new mysqli("localhost", "root", "", "caloriasbd");

if ($cx->connect_error) {
    $valido['mensaje'] = "Database connection failed: " . $cx->connect_error;
    echo json_encode($valido);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'];
    switch ($action) {
        case 'agregar':
            $a = $_POST['cate'];
            $b = $_POST['descr'];
            $c = $_POST['calori'];  // Correctly assign 'calori' to $c

            $sql = "INSERT INTO calorias VALUES (null, '$a', '$b', '$c')";
            if ($cx->query($sql)) {
                $valido['success'] = true;
                $valido['mensaje'] = "SE GUARDÓ CORRECTAMENTE";
            } else {
                $valido['success'] = false;
                $valido['mensaje'] = "ERROR AL GUARDAR EN BD: " . $cx->error;
            }
            echo json_encode($valido);
            break;

        case 'escribir':
            $sql = "SELECT * FROM calorias";
            $registro = array('data' => array());
            $res = $cx->query($sql);
            if ($res->num_rows > 0) {
                while ($row = $res->fetch_assoc()) {
                    $registro['data'][] = array(
                        'idc' => $row['idc'],
                        'cate' => $row['cate'],
                        'descr' => $row['descr'],
                        'calori' => $row['calori']
                    );
                }
            }
            echo json_encode($registro);
            break;

            case 'eliminar':
                $idc = $_POST['idc'];  
                $sql = "DELETE FROM calorias WHERE idc = $idc";  
                if ($cx->query($sql)) {
                    echo json_encode(array('success' => true));
                } else {
                    echo json_encode(array('success' => false, 'error' => $cx->error));
                }
                break;


                case 'actua':
                    $idc = $_POST['idc'];
                    $a = $_POST['cate'];
                    $b = $_POST['descr'];
                    $c = $_POST['calori'];
                
                    $sql = "UPDATE calorias SET cate = '$a', descr = '$b', calori = '$c' WHERE idc = '$idc' ";
                    if ($cx->query($sql)) {
                        echo json_encode(array('success' => true, 'mensaje' => 'SE ACTUALIZÓ CORRECTAMENTE'));
                    } else {
                        echo json_encode(array('success' => false, 'mensaje' => 'ERROR AL ACTUALIZAR EN BD: ', $cx->error));
                    }
                    break;

                    case 'calorias':
                        $sql = "SELECT * FROM calorias";
                        $registro = array('data' => array());
                        $res = $cx->query($sql);
                        if ($res->num_rows > 0) {
                            while ($row = $res->fetch_assoc()) {
                                $registro['data'][] = array(
                                    'categoria' => $row['cate'],
                                    'calorias' => $row['calori']
                                );
                            }
                        }
                        echo json_encode($registro);
                        break;


                         case 'consul':
                            header('Content-Type: text/html; charset=utf-8');
                            $valido['success']=array('success'=>false,
                            'mensaje'=>"",
                            'idc'=>"",
                            'cate'=>"",
                            'descr'=>"",
                            'calori'=>"");
                            if ($_POST) {
                                $idc = $_POST['idc'];
                
                                $sql = $sql="SELECT * FROM calorias WHERE idc=$idc";
                                $res = $cx->query($sql);
                                $row = $res->fetch_array();
                            
                                $valido['success'] = true;
                                $valido['mensaje'] = "bien";
                            
                                $valido['idc'] = $row[0];
                                $valido['cate'] = $row[1];
                                $valido['descr'] = $row[2];
                                $valido['calori'] = $row[3];
                            } else {
                                $valido['success'] = false;
                                $valido['mensaje'] = "error";
                            }
                break;
        
                        }  
}

?>