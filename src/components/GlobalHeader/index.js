/* eslint-disable new-cap */
import React, { useState, useContext, useEffect } from 'react';
import AppContext from '../../contexts/AppContext';
import {
  SignedUrl,
  getServiceProvider,
} from '../configuration/Gallery/SignedUrl';
import { Dropdown } from 'react-bootstrap';
import Switch from 'react-switch';
import LoginUser from './loginUser';
import { UserContext } from '../../contexts/UserContext';
import awzyBanner from '../../images/awzyLogo/awzy-banner.png';
import ReactPlayer from 'react-player';
import { FactoryMap } from '../configuration/Gallery/FactoryMap';

const socialMedias = [
  {
    name: 'Facebook',
    icon: 'fa fa-facebook',
    id: 'social_media_facebook',
  },
  {
    name: 'LinkedIn',
    icon: 'fa fa-linkedin',
    id: 'social_media_linkedIn',
  },
  {
    name: 'Twitter',
    icon: 'fa fa-twitter',
    id: 'social_media_twitter',
  },
  {
    name: 'Instagram',
    icon: 'fa fa-instagram',
    id: 'social_media_instagram',
  },
];

function GlobalHeader(props) {
  const { onLogAction } = props;
  const [appData] = useContext(AppContext);
  const userContext = useContext(UserContext);
  const [dropDownShown, setdropDown] = useState(false);
  const [audioShown, setAudioShown] = useState(false);
  const [videoShown, setVideoShown] = useState(false);
  const [social, setSocial] = useState([]);
  const [theme, setTheme] = useState(userContext.userData.theme);
  const [audioUrl, setAudioUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  const onToggleHandler = (isOpen, e) => {
    if (e.source !== 'select') {
      setdropDown(isOpen);
    }
  };

  useEffect(() => {
    userContext.updateUserData('theme', theme);
    userContext.updateUserData('videoShown', videoShown);
    userContext.updateUserData('audioShown', audioShown);
  }, [theme, videoShown, audioShown]);

  useEffect(() => {
    if (Object.keys(appData).length > 0) {
      const audioSp = getServiceProvider(appData.bgSong);
      const a =
        FactoryMap(audioSp, appData)?.library?.getSignedUrl(appData.bgSong) ||
        Promise.resolve({
          url: appData.bgSong,
          path: '',
          extension: '',
        });

      const videoSp = getServiceProvider(appData.bgVideo);
      const b =
        FactoryMap(videoSp, appData)?.library?.getSignedUrl(appData.bgVideo) ||
        Promise.resolve({
          url: appData.bgVideo,
          path: '',
          extension: '',
        });

      Promise.all([a, b]).then(r => {
        setAudioUrl(r[0].url);
        setVideoUrl(r[1].url);
      });
      setAudioShown(appData.bgSongDefaultPlay === '1');
      setVideoShown(appData.bgVideoDefaultPlay === '1');

      const appKeys = Object.keys(appData);
      const soc = [...socialMedias].map(s => {
        if (appKeys.includes(s.id)) {
          s.href = appData[s.id];
        }
        return s;
      });
      setSocial(soc);
    }
  }, [appData]);

  const openBlank = url => {
    const win = window.open(url, '_blank');
    win.focus();
  };

  return (
    <div>
      <ReactPlayer
        controls={false}
        loop={true}
        playing={audioShown}
        width="0px"
        height="0px"
        url={audioUrl}
        config={{
          forceAudio: true,
        }}
      />
      <ReactPlayer
        className="videoTag d-print-none"
        style={{ display: videoShown ? 'block' : 'none' }}
        playing={videoShown}
        loop={true}
        muted={true}
        controls={false}
        width="100%"
        height="100vh"
        url={videoUrl}
      />
      <div
        className={`globalHeader globalHeader-${userContext.userData.theme} d-print-none d-flex justify-content-between fixed-top`}
      >
        <div>
          {userContext.userData.type === 'public' && (
            <SignedUrl
              type="image"
              appData={appData}
              unsignedUrl={appData.bannerImg}
              className="brand global img-fluid"
              optionalAttr={{ width: '150', height: '40' }}
            />
          )}
          {userContext.userData.type !== 'public' && (
            <img className="brand img-fluid" alt="logoImage" src={awzyBanner} />
          )}
        </div>
        <div className="text-end">
          <Dropdown show={dropDownShown} onToggle={onToggleHandler}>
            <Dropdown.Toggle as="i">
              <i className={`fa fa-th-large gIcon icon-az`} />
            </Dropdown.Toggle>
            <Dropdown.Menu
              align="start"
              className={
                userContext.userData.theme === 'dark'
                  ? 'bg-dark text-white-50'
                  : 'bg-white text-black'
              }
            >
              <Dropdown.Item as="div">
                <LoginUser
                  onLogAction={o => {
                    onLogAction(o);
                    setdropDown(true);
                  }}
                />
              </Dropdown.Item>
              {Boolean(Number(appData.switchSongFeatureRequired)) && (
                <Dropdown.Item
                  as="div"
                  onClick={() => {
                    setAudioShown(!audioShown);
                  }}
                >
                  <div className="options">
                    <div className="labelText">Music</div>
                    <Switch
                      onColor={'#aaa'}
                      offColor={'#aaa'}
                      offHandleColor={
                        userContext.userData.theme === 'dark'
                          ? '#ffffff'
                          : '#000000'
                      }
                      onHandleColor={
                        userContext.userData.theme === 'dark'
                          ? '#ffffff'
                          : '#000000'
                      }
                      handleDiameter={15}
                      checkedIcon={false}
                      uncheckedIcon={false}
                      height={10}
                      width={40}
                      onChange={() => {
                        setAudioShown(!audioShown);
                      }}
                      checked={audioShown === true}
                    />
                  </div>
                </Dropdown.Item>
              )}
              {Boolean(Number(appData.switchVideoFeatureRequired)) && (
                <Dropdown.Item
                  as="div"
                  onClick={() => setVideoShown(!videoShown)}
                >
                  <div className="options">
                    <div className="labelText">Video</div>
                    <Switch
                      onColor={'#aaa'}
                      offColor={'#aaa'}
                      offHandleColor={
                        userContext.userData.theme === 'dark'
                          ? '#ffffff'
                          : '#000000'
                      }
                      onHandleColor={
                        userContext.userData.theme === 'dark'
                          ? '#ffffff'
                          : '#000000'
                      }
                      handleDiameter={15}
                      checkedIcon={false}
                      uncheckedIcon={false}
                      height={10}
                      width={40}
                      onChange={() => setVideoShown(!videoShown)}
                      checked={videoShown === true}
                    />
                  </div>
                </Dropdown.Item>
              )}
              {Boolean(Number(appData.switchThemeFeatureRequired)) && (
                <Dropdown.Item as="div">
                  <div className="options">
                    <button
                      className={`btn border-2 btn-sm btn-secondary`}
                      onClick={() => setTheme('dark')}
                    >
                      <small>Dark</small>
                    </button>
                    <button
                      className={`btn border-2 btn-sm btn-secondary`}
                      onClick={() => setTheme('light')}
                    >
                      <small>Light</small>
                    </button>
                  </div>
                </Dropdown.Item>
              )}
              {Boolean(Number(appData.switchSocialMediaFeatureRequired)) &&
                social.length > 0 && (
                  <Dropdown.Item as="div">
                    <div className="options text-center">
                      {social.map((media, i) => (
                        <a
                          className={
                            userContext.userData.theme === 'dark'
                              ? 'text-white-50'
                              : 'text-black-50'
                          }
                          key={i}
                          href={media.href}
                          onClick={() => openBlank(media.href)}
                        >
                          <i className={`${media.icon} social-icons`} />
                        </a>
                      ))}
                    </div>
                  </Dropdown.Item>
                )}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
      {props.children}
    </div>
  );
}

export default GlobalHeader;
