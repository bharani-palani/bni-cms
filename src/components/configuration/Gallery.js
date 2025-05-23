/* eslint-disable new-cap */
import React, { useState, useEffect, useContext } from 'react';
import UploadDropZone from './Gallery/UploadDropZone';
import BreadCrumbs from './Gallery/BreadCrumbs';
import GridData from './Gallery/GridData';
import ConfirmationModal from './Gallery/ConfirmationModal';
import AppContext from '../../contexts/AppContext';
import Tree from 'rc-tree';
import classNames from 'classnames';
import 'rc-tree/assets/index.css';
import { UserContext } from '../../contexts/UserContext';
import { v4 as uuidv4 } from 'uuid';
import Loader from 'react-loader-spinner';
import helpers from '../../helpers';
import { FactoryMap } from './Gallery/FactoryMap';

function Gallery(props) {
  const [appData] = useContext(AppContext);
  const userContext = useContext(UserContext);
  const [fileFolders, setFileFolders] = useState([]);
  const [breadCrumbs, setBreadCrumbs] = useState([]);
  const [directory, setDirectory] = useState('');
  const [isDirectory, setIsDirectory] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [deleteFolderId, setDeleteFolderId] = useState('');
  const [gridData, setGridData] = useState([]);
  const [openModal, setOpenModal] = useState(false); // change to false
  const [progress, setProgress] = useState({});
  const [bucketResponse, setBucketResponse] = useState(false);
  const [loader, setLoader] = useState(true);
  const galleryFactory = FactoryMap(appData.fileStorageType, appData).library;

  useEffect(() => {
    initMedia();
  }, []);

  const loaderComp = () => {
    return (
      <div className="relativeSpinner">
        <Loader
          type={helpers.loadRandomSpinnerIcon()}
          color={document.documentElement.style.getPropertyValue(
            '--app-theme-bg-color'
          )}
          height={100}
          width={100}
        />
      </div>
    );
  };

  const initMedia = () => {
    galleryFactory
      .fetchFileFolder({ Prefix: '' })
      .then(res => {
        setLoader(true);
        if (res.Contents && res.Contents.length > 0) {
          const data = res.Contents.filter(f => f.Key.slice(-1) !== '/');
          const result = tree(data);
          setFileFolders(result);
        } else {
          const uuid = uuidv4();
          const sampleArray = [
            {
              Key: 'SampleFolder/Samplefile.txt',
              LastModified: new Date(),
              ETag: uuid,
              Size: 0,
            },
          ];
          const sampleResult = tree(sampleArray);
          setFileFolders(sampleResult);
        }
        setBucketResponse(true);
      })
      .catch(e => {
        setBucketResponse(false);
      })
      .finally(() => setLoader(false));
  };

  const isFile = pathname => {
    return pathname.split('/').pop().indexOf('.') > -1;
  };

  useEffect(() => {
    if (breadCrumbs && breadCrumbs.length > 0) {
      const breads = [...breadCrumbs.map(b => b.title)];
      const link = isFile(breads.join('/'))
        ? breads.join('/')
        : `${breads.join('/')}/`;
      setDirectory(link);
      const IsDirectory = !isFile(breads.join('/'));
      setIsDirectory(IsDirectory);
      setGridData([]);
      galleryFactory
        .fetchFileFolder({ Prefix: link })
        .then(res => {
          const list =
            res.Contents && res.Contents.length
              ? res.Contents.map(cont => ({
                  label: cont.Key,
                  url: cont.Key,
                  lastModified: cont.LastModified,
                  size: cont.Size,
                  tag: cont.ETag,
                }))
              : [];
          setGridData(list);
        })
        .catch(() => {
          userContext.renderToast({
            type: 'error',
            icon: 'fa fa-times-circle',
            message: 'Unable to reach server',
          });
        });
    }
  }, [JSON.stringify(breadCrumbs)]);

  const tree = array => {
    const result = [];
    const o = { z: result };
    array.forEach((a, i) => {
      const pieces = a.Key.split('/');
      pieces.reduce((r, b) => {
        if (!r[b]) {
          r[b] = { z: [] };
          r.z.push({
            key: uuidv4(),
            title: b,
            ...(pieces[pieces.length - 1] !== b && { children: r[b].z }),
          });
        }
        return r[b];
      }, o);
    });
    return result;
  };

  const find = (node, key) => {
    if (node.key === key) {
      return [];
    }
    if (Array.isArray(node.children)) {
      for (const treeNode of node.children) {
        const childResult = find(treeNode, key);
        if (Array.isArray(childResult)) {
          return [treeNode].concat(childResult);
        }
      }
    }
  };

  const onSelect = selectedKeys => {
    if (selectedKeys[0]) {
      setBreadCrumbs(find({ children: [...fileFolders] }, selectedKeys[0]));
      setSelectedId(selectedKeys[0]);
    }
  };

  const Icon = obj => {
    const { data } = obj;
    return (
      <i
        className={classNames(
          'fa fa-folder icon',
          !data.children && 'fa fa-file icon'
        )}
      />
    );
  };

  const findAndAddFileOrFolder = (key, json, node, target) => {
    if (Array.isArray(node)) {
      node.forEach(i => {
        if (i.key === key) {
          if (i.children && target === 'folder') {
            i.children = [...i.children, json];
          } else if (target === 'file') {
            i.children.push(json);
          }
        } else {
          findAndAddFileOrFolder(key, json, i.children, target);
        }
      });
    }
    return node;
  };

  const findAndEditFolder = (key, newTitle, node) => {
    if (Array.isArray(node)) {
      node.forEach(i => {
        if (i.key === key) {
          i.title = newTitle;
        } else {
          findAndEditFolder(key, newTitle, i.children);
        }
      });
    }
    return node;
  };

  const onCreateFileOrFolder = (key, value, target) => {
    const newKey = uuidv4();
    const obj = { key: newKey, title: value, ...(target && { children: [] }) };
    const bFileFolders = [...fileFolders];
    const newFolders = findAndAddFileOrFolder(key, obj, bFileFolders, target);
    setFileFolders(newFolders);
    onSelect([newKey]);
  };

  const findAndDeleteFolder = (key, node) => {
    if (Array.isArray(node)) {
      node.forEach((i, j) => {
        if (i.key === key) {
          node.splice(j, 1);
        } else {
          findAndDeleteFolder(key, i.children);
        }
      });
    }
    return node;
  };

  const onDeleteFolder = id => {
    setOpenModal(true);
    setDeleteFolderId(id);
  };

  const deleteFolderAction = () => {
    galleryFactory.deleteFolder(directory, res => {
      if (res.status === 'success') {
        userContext.renderToast({
          message: isDirectory
            ? 'Folder successfully deleted'
            : 'File successfully deleted',
        });
      } else {
        userContext.renderToast({
          type: 'error',
          icon: 'fa fa-times-circle',
          message: 'Unable to delete file or folder',
        });
      }
    });
    const bFileFolders = [...fileFolders];
    const newFolders = findAndDeleteFolder(deleteFolderId, bFileFolders);
    setFileFolders(newFolders);
    setOpenModal(false);
    reset();
  };

  const onRename = (object, selId, isDir) => {
    const promise = isDir
      ? galleryFactory.renameFolder(object)
      : galleryFactory.renameFile(object);
    promise
      .then(() => {
        userContext.renderToast({
          message: isDirectory
            ? 'Folder renamed successfully'
            : 'File renamed successfully',
        });
      })
      .catch(() => {
        userContext.renderToast({
          type: 'error',
          icon: 'fa fa-times-circle',
          message: isDirectory
            ? 'Unable to rename folder'
            : 'Unable to rename file',
        });
      })
      .finally(() =>
        setTimeout(() => {
          const bFileFolders = [...fileFolders];
          const newFolders = findAndEditFolder(
            selId,
            object.newKey.split('/').slice(-1),
            bFileFolders
          );
          setFileFolders(newFolders);
          onSelect([selId]);
        }, 1000)
      );
  };

  const handleupload = files => {
    try {
      files.forEach(file => {
        const fileName = file.name.replaceAll(' ', '_');
        const target = {
          Key: `${directory}${fileName}`,
          Body: file,
          ContentType: file.type,
        };
        const instance = galleryFactory.uploadFile(target);
        instance
          .on('httpUploadProgress', progress => {
            setProgress(progress);
          })
          .done()
          .then(d => {
            onCreateFileOrFolder(selectedId, fileName, 'file');
            userContext.renderToast({
              message: fileName + ' uploaded successfully',
            });
          })
          .catch(e => {
            console.error('bbb', e);
            userContext.renderToast({
              type: 'error',
              icon: 'fa fa-times-circle',
              message: `unable to upload file ${fileName}. Please try again`,
            });
          });
      });
    } catch (err) {
      console.error('bbb', err);
      userContext.renderToast({
        type: 'error',
        icon: 'fa fa-times-circle',
        message: 'Unable to start upload please try again',
      });
    }
  };

  const onDownload = route => {
    galleryFactory.downloadToBrowser(route);
  };

  const onBreadClick = object => {
    onSelect([object.key]);
  };

  const reset = () => {
    setBreadCrumbs([]);
    setDirectory('');
    setSelectedId('');
    setDeleteFolderId('');
    setGridData([]);
    setIsDirectory(false);
  };

  return !loader ? (
    <div className="galleryContainer">
      {openModal && (
        <ConfirmationModal
          show={openModal}
          confirmationstring={
            isDirectory
              ? 'Are you sure to delete folder?'
              : 'Are you sure to delete file?'
          }
          handleHide={() => {
            setOpenModal(false);
            setDeleteFolderId('');
          }}
          handleYes={() => deleteFolderAction()}
          size="md"
          animation={false}
        />
      )}
      {bucketResponse ? (
        <div className="row ms-0 me-0">
          <div className="col-lg-3 col-md-4 leftPane">
            <div
              className={`${
                userContext.userData.theme === 'dark' ? 'bg-dark' : 'bg-white'
              }`}
            >
              <h6 className="icon-bni text-center animate__animated animate__bounceInLeft p-2">
                {appData['fileStorageType']}
              </h6>
            </div>
            <div className="listContainer">
              {fileFolders.length > 0 && (
                <Tree
                  treeData={fileFolders}
                  icon={Icon}
                  showLine={true}
                  checkable={false}
                  selectable={true}
                  onSelect={onSelect}
                  selectedKeys={[selectedId]}
                  defaultExpandAll={true}
                  key={selectedId}
                />
              )}
            </div>
          </div>
          <div className="col-lg-9 col-md-8 rightPane pt-0 ps-2 pe-2 pb-2">
            <BreadCrumbs
              breadCrumbs={breadCrumbs}
              onBreadClick={onBreadClick}
            />
            <UploadDropZone
              isDirectory={isDirectory}
              handleupload={files => handleupload(files)}
              progress={progress}
            />
            <GridData
              key={1}
              data={gridData}
              directory={directory}
              selectedId={selectedId}
              onCreateFolder={(key, value) =>
                onCreateFileOrFolder(key, value, 'folder')
              }
              isDirectory={isDirectory}
              onDeleteFolder={onDeleteFolder}
              onRename={(object, id, isDir) => onRename(object, id, isDir)}
              onDownload={path => onDownload(path)}
            />
          </div>
        </div>
      ) : (
        <div className="mt-5 p-5 text-center rounded-3">
          <i className="fa fa-times-circle fa-3x text-danger" />
          <h4>Configuration is invalid</h4>
          <h5>Please check connection parameters</h5>
        </div>
      )}
    </div>
  ) : (
    loaderComp()
  );
}

export default Gallery;
