/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react';
import { LayoutContext } from '../layoutDesign';
import * as FunctionalComponents from '../FunctionalComponents';
import { InputGroup, FormControl, Button } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';

function Functional(props) {
  const layoutContext = useContext(LayoutContext);
  const [compList] = useState(Object.keys(FunctionalComponents));
  const [selectedComponent, setSelectedComponent] = useState({
    comp: '',
    apiUrl: '',
  });

  const saveFunction = () => {
    const sample = {
      key: uuidv4(),
      props: {
        apiUrl: selectedComponent.apiUrl,
      },
      title: selectedComponent.comp,
      children: [],
      component: `${selectedComponent.comp}`,
    };

    const newObject = findAndAddComponent(
      layoutContext.state.selectedNodeId,
      { ...layoutContext.state.pageDetails.pageObject },
      sample
    );
    layoutContext.setState(prevState => ({
      ...prevState,
      selectedNodeId: sample.key,
      selectedComponent: sample.component,
      pageDetails: {
        ...prevState.pageDetails,
        pageObject: newObject,
      },
    }));
  };

  const findAndAddComponent = (key, node, insertObj) => {
    if (node.key === key) {
      node.children &&
        Array.isArray(node.children) &&
        node.children.push(insertObj);
    }
    node.children &&
      node.children.length > 0 &&
      node.children.forEach(ch => {
        findAndAddComponent(key, ch, insertObj);
      });
    return node;
  };

  const findAndUpdateProps = (arr, selectedKey, updatedFormList) => {
    return arr.map(item => {
      if (item.key === selectedKey) {
        const { style } = item.props;
        const keyValues = updatedFormList.map(u => [u.newKey, u.value]);
        item.props = {
          ...Object.fromEntries(keyValues),
          ...(style && { style }),
        };
      }
      item.children = findAndUpdateProps(
        item.children,
        selectedKey,
        updatedFormList
      );
      return item;
    });
  };

  return (
    <LayoutContext.Consumer>
      {layoutDetails =>
        layoutDetails.state.selectedNodeId ? (
          <div>
            <div className="d-grid mb-1">
              <select
                className="form-select form-select-sm"
                onChange={e =>
                  setSelectedComponent(prevState => ({
                    ...prevState,
                    comp: e.target.value,
                  }))
                }
              >
                <option value="">Select</option>
                {compList.length > 0 &&
                  compList.map((comp, i) => (
                    <option key={i} value={comp}>
                      {comp}
                    </option>
                  ))}
              </select>
            </div>
            <FormControl
              className="mb-1"
              size="sm"
              placeholder="/api/url"
              value={selectedComponent.bind}
              onChange={e =>
                setSelectedComponent(prevState => ({
                  ...prevState,
                  apiUrl: e.target.value,
                }))
              }
            />
            <div className="d-grid mb-1">
              <Button
                size="sm"
                variant="primary"
                disabled={!selectedComponent.comp && !selectedComponent.apiUrl}
                onClick={() => saveFunction()}
              >
                <i className="fa fa-thumbs-o-up" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-muted small px-1">Please select a component</div>
        )
      }
    </LayoutContext.Consumer>
  );
}

export default Functional;
