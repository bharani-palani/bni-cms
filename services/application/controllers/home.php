<?php
defined('BASEPATH') or exit('No direct script access allowed');
class home extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('home_model');
        $this->load->library('../controllers/auth');
        $this->check = $this->auth->validateToken();
    }
    public function index()
    {
        // Note: Token validation shud`nt be set here
        $config = $this->home_model->get_config();
        $data['response'] = [
            array_merge($config[0], [
                'token' => $this->auth->generateToken(),
            ]),
        ];
        $this->auth->response($data);
    }
    public function getBackend()
    {
        if ($this->check['status'] === 'success') {
            $post = [
                'TableRows' => $this->input->post('TableRows'),
                'Table' => $this->input->post('Table'),
            ];
            $data['response'] = $this->home_model->getBackend($post);
            $this->auth->response($data, []);
        } else {
            $this->auth->tokenException($this->check);
        }
    }
    public function postBackend()
    {
        if ($this->check['status'] === 'success') {
            $post = [
                'postData' => $this->input->post('postData'),
            ];
            $data['response'] = $this->home_model->postBackend($post);
            $this->auth->response($data, []);
        } else {
            $this->auth->tokenException($this->check);
        }
    }
    public function validateUser()
    {
        if ($this->check['status'] === 'success') {
            $post = [
                'username' => $this->input->post('username'),
                'password' => $this->input->post('password'),
            ];
            $data['response'] = $this->home_model->validateUser($post);
            $this->auth->response($data, []);
        } else {
            $this->auth->tokenException($this->check);
        }
    }
    public function fetchAccessLevels()
    {
        if ($this->check['status'] === 'success') {
            $data['response'] = $this->home_model->fetchAccessLevels();
            $this->auth->response($data, []);
        } else {
            $this->auth->tokenException($this->check);
        }
    }
    public function fetchUsers()
    {
        if ($this->check['status'] === 'success') {
            $data['response'] = $this->home_model->fetchUsers();
            $this->auth->response($data, []);
        } else {
            $this->auth->tokenException($this->check);
        }
    }
    public function checkUserExists()
    {
        if ($this->check['status'] === 'success') {
            $post = [
                'username' => $this->input->post('username'),
                'email' => $this->input->post('email'),
            ];
            $data['response'] = $this->home_model->checkUserExists($post);
            $this->auth->response($data, []);
        } else {
            $this->auth->tokenException($this->check);
        }
    }
    public function changePassword()
    {
        if ($this->check['status'] === 'success') {
            $post = [
                'userName' => $this->input->post('userName'),
                'currentPass' => $this->input->post('currentPass'),
                'newPass' => $this->input->post('newPass'),
                'repeatPass' => $this->input->post('repeatPass'),
            ];
            $data['response'] = $this->home_model->changePassword($post);
            $this->auth->response($data, []);
        } else {
            $this->auth->tokenException($this->check);
        }
    }
    public function random_otp()
    {
        $alphabet = '1234567890';
        $password = [];
        $alpha_length = strlen($alphabet) - 1;
        for ($i = 0; $i < 6; $i++) {
            $n = rand(0, $alpha_length);
            $password[] = $alphabet[$n];
        }
        return implode($password);
    }

    function random_password()
    {
        $alphabet =
            'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
        $password = [];
        $alpha_length = strlen($alphabet) - 1;
        for ($i = 0; $i < 8; $i++) {
            $n = rand(0, $alpha_length);
            $password[] = $alphabet[$n];
        }
        return implode($password);
    }

    public function resetPassword()
    {
        $post = [
            'otp' => $this->input->post('otp'),
            'id' => $this->input->post('id'),
            'email' => $this->input->post('email'),
        ];
        $validateOtpTime = $this->home_model->validateOtpTime($post);
        if ($validateOtpTime) {
            $config = $this->home_model->get_config();
            $web = $config[0]['web'];
            $email = $config[0]['email'];

            $resetPassword = $this->random_password();
            $update = $this->home_model->resetUpdate(
                $post['id'],
                $resetPassword
            );
            if ($update) {
                $this->email->from(
                    'do-not-reply@' . explode('@', $email)[1],
                    'Support Team'
                );
                $this->email->to($post['email']);
                $this->email->subject($web . ' Your new password!');
                $this->email->message(
                    $resetPassword .
                        ' is your new password. Please change them periodically.'
                );
                if ($this->email->send()) {
                    $data['response'] = true;
                } else {
                    $data['response'] = false;
                }
            } else {
                $data['response'] = false;
            }
        } else {
            $data['response'] = false;
        }
        $this->auth->response($data, []);
    }

    public function sendUserInfo()
    {
        if ($this->check['status'] === 'success') {
            $post = [
                'email' => $this->input->post('email'),
                'userName' => $this->input->post('userName'),
                'password' => $this->input->post('password'),
            ];
            if (
                isset($post['userName']) &&
                isset($post['password']) &&
                isset($post['email'])
            ) {
                $config = $this->home_model->get_config();
                $web = $config[0]['web'];
                $email = $config[0]['email'];

                $this->email->from(
                    'do-not-reply@' . explode('@', $email)[1],
                    'Support Team'
                );
                $this->email->to($post['email']);
                $this->email->subject('Your new ' . $web . ' credentials!');
                $this->email->message(
                    'Hello, ' .
                        $post['userName'] .
                        ' is your user name and ' .
                        $post['password'] .
                        ' is your password. Please login with these credentials on ' .
                        $web .
                        '. Please contact administrator on further details.'
                );
                if ($this->email->send()) {
                    $data['response'] = true;
                } else {
                    $data['response'] = false;
                }
            }
        } else {
            $this->auth->tokenException($this->check);
        }
    }

    public function sendOtp()
    {
        if ($this->check['status'] === 'success') {
            $post = [
                'email' => $this->input->post('email'),
            ];
            $userId = $this->home_model->checkValidEmail($post);
            if ($userId !== false) {
                $config = $this->home_model->get_config();
                $web = $config[0]['web'];
                $email = $config[0]['email'];

                $otp = $this->random_otp();
                $otpAction = $this->home_model->otpUpdate($userId, $otp);
                if ($otpAction) {
                    $this->email->from(
                        'do-not-reply@' . explode('@', $email)[1],
                        'Support Team'
                    );
                    $this->email->to($post['email']);
                    $this->email->subject($web . ' OTP for password reset');
                    $this->email->message(
                        $otp .
                            ' is your OTP (One Time Password) to reset password. This is valid only for next 5 minutes. Please do not share with anyone. If this mail was not sent on your consent, report this to your admin immediately.'
                    );
                    if ($this->email->send()) {
                        $data['response'] = $userId;
                    } else {
                        $data['response'] = false;
                    }
                } else {
                    $data['response'] = false;
                }
            } else {
                $data['response'] = false;
            }
            $this->auth->response($data, []);
        } else {
            $this->auth->tokenException($this->check);
        }
    }
    public function saveLog()
    {
        if ($this->check['status'] === 'success') {
            $post = json_decode($this->input->post('log'));
            $this->home_model->saveLog($post);
        } else {
            $this->auth->tokenException($this->check);
        }
    }
}
