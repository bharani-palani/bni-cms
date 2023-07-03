<?php
defined('BASEPATH') or exit('No direct script access allowed');
class auth extends CI_Controller
{
    protected $secretKey = 'awzyisawesome';
    protected $iss = 'https://awzy.org';
    protected $aud = 'https://awzy.org';

    public function __construct()
    {
        parent::__construct();
    }
    public function info($passed)
    {
        $ci = &get_instance();
        $data['server'] = $_SERVER['SERVER_NAME'];
        $data['baseUrl'] = base_url();
        $data['requestUrl'] = current_url();
        $data['requestMethod'] = $_SERVER['REQUEST_METHOD'];
        $data['codeigniter_version'] = CI_VERSION;
        $data['phpVersion'] = phpversion();
        $data['memory_usage'] = $ci->benchmark->memory_usage();
        $data['elapsedTime'] = $ci->benchmark->elapsed_time();
        foreach ($passed as $key => $val) {
            $data[$key] = $val;
        }
        return $data;
    }

    public function generateToken()
    {
        $payload = [
            'iss' => $this->iss,
            'aud' => $this->aud,
            'iat' => strtotime('now'),
            'exp' => strtotime('+1 day'),
        ];
        $jwt = JWT::encode($payload, $this->secretKey, 'HS256');
        return $jwt;
    }

    public function decodedToken($jwt)
    {
        $decoded = JWT::decode($jwt, $this->secretKey);
        return $decoded;
    }

    public function validateToken()
    {
        $object = apache_request_headers();
        $res = [];
        if (isset($object['Awzy-Authorization'])) {
            try {
                $decoded = $this->decodedToken($object['Awzy-Authorization']);
                $check =
                    is_object($decoded) &&
                    $decoded->iss === $this->iss &&
                    $decoded->iat <= time() &&
                    $decoded->exp >= time();
                $res = $check
                    ? [
                        'status' => 'success',
                        'message' => 'Token is good',
                    ]
                    : [
                        'status' => 'failed',
                        'message' => 'Token expired',
                        // [$check, $decoded, time()],
                    ];
            } catch (Exception $e) {
                $res = [
                    'status' => 'failed',
                    'message' => $e->getMessage(),
                ];
            }
        } else {
            $res = [
                'status' => 'failed',
                'message' => 'Token not found',
            ];
        }
        return $res;
    }

    public function response($response, $passed = [])
    {
        $ci = &get_instance();
        $ci->output->set_content_type('application/json');
        $ci->output->set_status_header(200);
        header('Access-Control-Allow-Origin: *');

        $output = array_merge($this->info($passed), $response);
        $ci->output->set_output(json_encode($output));
    }

    public function tokenException($exc)
    {
        $ci = &get_instance();
        $ci->output->set_content_type('application/json');
        $ci->output->set_status_header(401);
        $ci->output->set_output(json_encode($exc));
    }
    public function renderFile($fileURL)
    {
        $ci = &get_instance();
        if (!file_exists($fileURL)) {
            exit('File not found!');
        }
        $ci->load->helper('file');
        $ci->output
            ->set_header('Content-Disposition: inline; filename="'.basename($fileURL).'"')
            ->set_content_type(get_mime_by_extension($fileURL))
            ->set_output(file_get_contents($fileURL));
    }
    public function renderPartial($fileURL)
    {
        $ci = &get_instance();
        if (!file_exists($fileURL)) {
            exit('File not found!');
        }
        $filesize = filesize($fileURL);
        $begin  = 0;
        $end  = $filesize - 1;

        header("Content-Range: bytes $begin-$end/$filesize");
        header('HTTP/1.1 206 Partial Content');
        header('Content-Length: ' . $filesize);
        header('Content-Type: '.get_mime_by_extension(APPPATH."upload/".$fileURL));
        header('Accept-Ranges: bytes');
        readfile($fileURL);
    }

}
