import React, { useContext, useEffect, useState } from 'react';
import Tree from 'rc-tree';
import { LayoutContext } from './layoutDesign';
import { v4 as uuidv4 } from 'uuid';
import { UserContext } from '../../contexts/UserContext';
import _ from 'lodash';

function PageTree(props) {
  const layoutContext = useContext(LayoutContext);
  const userContext = useContext(UserContext);
  const [pasteId, setPasteId] = useState({});

  const onSelect = (selectedKeys, e) => {
    layoutContext.setState(prevState => ({
      ...prevState,
      selectedNodeId: e.node.key,
      selectedComponent: e.node.component,
    }));
  };

  const onDrop = info => {
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition =
      info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (data, key, callback) => {
      data.forEach((item, index, arr) => {
        if (item.key === key) {
          callback(item, index, arr);
          return;
        }
        if (item.children) {
          loop(item.children, key, callback);
        }
      });
    };

    const data = [{ ...layoutContext.state.pageDetails.pageObject }];

    // Find dragObject
    let dragObj;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (dropPosition === 0) {
      loop(data, dropKey, item => {
        item.children = item.children || [];
        item.children.unshift(dragObj);
      });
    } else {
      let ar;
      let i;
      loop(data, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
    }

    layoutContext.setState(prevState => ({
      ...prevState,
      selectedNodeId: '',
      selectedComponent: '',
      pageDetails: {
        ...prevState.pageDetails,
        pageObject: data[0],
      },
    }));
  };

  useEffect(() => {
    const isValidUUID = id => {
      return new RegExp(
        /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
      ).test(id);
    };
    const onKeyDown = ({ key }) => {
      if (key === 'Delete' && layoutContext.state.selectedNodeId) {
        const details = [{ ...layoutContext.state.pageDetails.pageObject }];
        const id = layoutContext.state.selectedNodeId;
        if (id !== details[0].key) {
          const newObject = findAndDeleteComponent(details, id)[0];
          layoutContext.setState(prevState => ({
            ...prevState,
            selectedNodeId: '',
            selectedComponent: '',
            pageDetails: {
              ...prevState.pageDetails,
              pageObject: newObject,
            },
          }));
        } else {
          userContext.renderToast({
            type: 'error',
            icon: 'fa fa-times-circle',
            message: 'You cant delete a parent node..',
          });
        }
      }
    };
    const onCopy = e => {
      const sel =
        window.getSelection().toString().length > 0
          ? window.getSelection().toString()
          : layoutContext.state.selectedNodeId;
      if (isValidUUID(sel)) {
        const selection = sel;
        e.clipboardData.setData('text/plain', selection);
        e.preventDefault();
        userContext.renderToast({
          message:
            'Component copied. Please select a node to paste your copied component.',
        });
      }
    };

    const onPaste = e => {
      const selection = e.clipboardData || window.clipboardData;
      const copiedId = selection.getData('Text');
      if (isValidUUID(copiedId)) {
        setPasteId(copiedId);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('copy', onCopy);
    document.addEventListener('paste', onPaste);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('copy', onCopy);
      document.removeEventListener('paste', onPaste);
    };
  }, [layoutContext.state.selectedNodeId]);

  const creteNewKeysToObject = arr => {
    return arr.map(item => {
      if (item.key) {
        item.key = uuidv4();
      }
      if (item.children) {
        item.children = creteNewKeysToObject(item.children);
      }
      return item;
    });
  };

  const findAndAddComponent = (key, node, insertObj) => {
    if (node.key === key) {
      node.children.push(insertObj);
    }
    if (node.children) {
      node.children.forEach(ch => {
        findAndAddComponent(key, ch, insertObj);
      });
    }
    return node;
  };

  let r = {};
  const findAndAddGetObject = (obj, selectedKey) => {
    if (obj.key === selectedKey) {
      r = obj;
    }
    obj.children.length > 0 &&
      obj.children.forEach(item => {
        findAndAddGetObject(item, selectedKey);
      });
    return r;
  };

  useEffect(() => {
    const nodeId = layoutContext.state.selectedNodeId;
    const details = _.cloneDeep(layoutContext.state.pageDetails.pageObject);

    const selectedData = _.cloneDeep(findAndAddGetObject(details, pasteId));
    if (Object.keys(selectedData).length > 0) {
      const reKeyedData = _.cloneDeep(creteNewKeysToObject([selectedData])[0]);
      const newObject = _.cloneDeep(
        findAndAddComponent(nodeId, details, reKeyedData)
      );

      layoutContext.setState(prevState => ({
        ...prevState,
        selectedNodeId: reKeyedData.key,
        selectedComponent: reKeyedData.component,
        pageDetails: {
          ...prevState.pageDetails,
          pageObject: newObject,
        },
      }));
    }
  }, [pasteId]);

  const findAndDeleteComponent = (arr, selectedKey) => {
    return arr
      .filter(item => item.key !== selectedKey)
      .map(item => {
        item = Object.assign({}, item);
        if (item.children) {
          item.children = findAndDeleteComponent(item.children, selectedKey);
        }
        return item;
      });
  };

  return (
    <LayoutContext.Consumer>
      {layoutDetails => (
        <div className="mt-2 mb-5">
          {layoutDetails.state.pageDetails &&
            Object.keys(layoutDetails.state.pageDetails).length > 0 && (
              <Tree
                treeData={[{ ...layoutDetails.state.pageDetails.pageObject }]}
                showLine={true}
                checkable={false}
                selectable={true}
                onSelect={onSelect}
                selectedKeys={[layoutDetails.state.selectedNodeId]}
                defaultExpandAll={true}
                autoExpandParent={true}
                defaultExpandParent={true}
                key={layoutDetails.state.pageDetails.pageObject.key}
                style={{
                  width: '800px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                showIcon={false}
                draggable={true}
                onDrop={onDrop}
              />
            )}
        </div>
      )}
    </LayoutContext.Consumer>
  );
}

export default PageTree;
