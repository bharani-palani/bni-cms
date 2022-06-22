import React, { useState, useContext, useEffect } from 'react';
import { LayoutContext } from '../layoutDesign';
import { FormControl, Button } from 'react-bootstrap';

function MetaList(props) {
  const layoutContext = useContext(LayoutContext);
  const [metaConfig, setMetaConfig] = useState({
    title: '',
    description: '',
    keywords: '',
  });

  useEffect(() => {
    setMetaConfig(layoutContext.state.pageDetails.pageMeta);
  }, [layoutContext.state.pageDetails.pageMeta]);

  const onSaveMeta = () => {
    layoutContext.setState(prevState => ({
      ...prevState,
      pageDetails: {
        ...prevState.pageDetails,
        pageMeta: metaConfig,
      },
    }));
  };

  return (
    <LayoutContext.Consumer>
      {layoutDetails => (
        <div>
          <FormControl
            size="sm"
            placeholder="Title"
            value={metaConfig.title}
            onChange={e =>
              setMetaConfig(prevState => ({
                ...prevState,
                title: e.target.value,
              }))
            }
            className="mb-1"
          />
          <FormControl
            size="sm"
            as="textarea"
            rows={5}
            placeholder="Description"
            value={metaConfig.description}
            onChange={e =>
              setMetaConfig(prevState => ({
                ...prevState,
                description: e.target.value,
              }))
            }
            className="mb-1"
          />
          <FormControl
            size="sm"
            placeholder="Keywords (Comma separated)"
            value={metaConfig.keywords}
            onChange={e =>
              setMetaConfig(prevState => ({
                ...prevState,
                keywords: e.target.value,
              }))
            }
            className="mb-1"
          />
          <div className="d-grid mb-1">
            <Button
              size="sm"
              disabled={false}
              variant="primary"
              onClick={() => onSaveMeta()}
            >
              <i className="fa fa-thumbs-o-up" />
            </Button>
          </div>
        </div>
      )}
    </LayoutContext.Consumer>
  );
}

export default MetaList;
