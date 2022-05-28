import React, { useState, useContext, useEffect, useRef } from 'react';
import { Accordion, Card, useAccordionButton } from 'react-bootstrap';
import { UserContext } from '../../../contexts/UserContext';
import BuiltInList from './BuiltInList';
import BootstrapList from './BootstrapList';
import PropsList from './PropsList';
import StyleList from './StyleList';
import Title from './Title';
import CreateAjaxForm from './CreateAjaxForm';
import CreateAjaxFetch from './CreateAjaxFetch';
import Database from './Database/';
import { LayoutContext } from '../layoutDesign';
import AppContext from '../../../contexts/AppContext';
import OffCanvas from '../../shared/OffCanvas';

function SideMenu(props) {
  const userContext = useContext(UserContext);
  const [appData] = useContext(AppContext);
  const layoutContext = useContext(LayoutContext);
  const [scrollPosition, setScrollPosition] = useState(0);
  const ref = useRef(null);
  const [sideMenu] = useState([
    {
      id: 0,
      label: 'Components',
      children: [
        { id: 0.1, label: 'Built in', body: <BuiltInList /> },
        { id: 0.2, label: 'Bootstrap', body: <BootstrapList /> },
      ],
      help: {
        heading: 'Components help',
        points: [
          'There are 2 types of components you can integrate,',
          'Built in and Bootstrap.',
          'Built in - consists list of HTML components. Hope you ve configured google maps key and AWS keys to integrate them.',
          'Googlemaps -  requires defaultZoom(num)(1 to 20), lat(float), lng(float), height(int)(pixels) as props.',
          'GoogleMapsMarker - This should be a child of Googlemaps. It requires lat, lng as props. If directly added as a parent, an exception will be thrown.',
          'awsmedia - requires type, className, unsignedUrl as props. type - can be image, video & audio | className - for styling | unsignedUrl - Ex: bucketName/fileNameWithLocation which you can copy them from AWS module in config.',
          'Bootstrap - consists list of reusable components.',
          'You need some basic knowledge on <a target="_blank" href="https://www.w3schools.com/html/" class="btn-link">HTML</a>, <a target="_blank" href="https://getbootstrap.com/docs/5.1/getting-started/introduction/" class="btn-link">Bootsrap 5</a> & <a target="_blank" href="https://react-bootstrap.github.io/getting-started/introduction/" class="btn-link">React-Bootsrap</a> before starting.',
          'You can construct your layout with the above, which can be altered or updated on runtime, without changing your code base.',
          'On just clicking this component, it can be added to your page, which can be viewed in the preview tab while designing.',
          'Note: ',
          'Dont forget to click your parent or child node (in Tree tab) before adding one.',
          'While your node is selected (Underlined node in tree tab), You can copy and paste anywhere in the tree, to avoid design repetition.',
          'You can drag and drop the node to maintain order or move to a particular position.',
          'You can delete the component by pressing the Delete key, whenever not required.',
          'You cant delete a parent node, which wraps all your components.',
          'The Structure tab describes component data structure information, which can be viewed on a click of each node. This tab is only for information purpose.',
          'Dont forget to Save page after successful design.',
          'Once Saved & design is done, dont forget to Publish your page.',
          'Only Published pages can be viewable to the end user.',
        ],
      },
    },
    {
      id: 1,
      label: 'Arguments',
      children: [
        { id: 1.1, label: 'Props', body: <PropsList /> },
        { id: 1.2, label: 'Style', body: <StyleList /> },
        { id: 1.3, label: 'Title', body: <Title /> },
      ],
      help: {
        heading: 'Arguments help',
        points: [
          'There are 3 layers of arguments you can maintain for a component',
          'Props, <a target="_blank" href="https://www.w3schools.com/react/react_css.asp" class="btn-link">Style</a> & Title',
          'Props - Holds a key value pair, which can be added for component props for built in or react components. "className" property with value can be added here for CSS class styles. You can even add any valid HTML attributes like aria, title etc.. based on your requirement. Click plus or save button for changes to take effect.',
          'Style - Inline styles can be added as key value pair for css properties to take effect. Note: The key field should be camel cased. Click plus or save button for changes to take effect.',
          'Title - The value label for an element. Key in & click Thumbs up <i class="fa fa-thumbs-up"></i> button for changes to take effect.',
          'Note: ',
          'Click Preview tab to view your UI changes.',
          'Dont forget to Save & Publish once done.',
        ],
      },
    },
    {
      id: 2,
      label: 'Ajax Form',
      body: <CreateAjaxForm />,
      help: {
        heading: 'Ajax Form help',
        points: [
          'A dynamic Ajax Form is available for your visitors to key in valuable information which can be saved in your database.',
          'Dont start this config unless a table is created to your database. You can create 1 or more tables of your choice. Click the Database tab on the side menu to create one.',
          'Be ready with your table schema while creating a form.',
          'POST Table - The table where your data is stored.',
          'Wrapper class - The class property which will be appended to your parent element in your form. This helps to alter form style with your own css rules. Update _custom.scss for such alterations.',
          'Submit label - The label value of your submit button. Ex: Save, Post, Update etc..',
          'Success message - The prompt user gets when a user posts the form successfully.',
          'Add form elements: ',
          'You have some predefined form elements in the drop down which can be selected of your choice.',
          'On select - The form element will be added (toggleable config). You can add "n" number of elements of your choice',
          'You need to configure some parameters like id, index etc..',
          'Once all your form fields are added, click the thumbs up <i class="fa fa-thumbs-up"></i> button to see your output in the preview tab.',
          'Dont forget to Save & Publish once done.',
          '<b>Note: (config parameters)</b>',
          'The id should be unique across all form elements',
          'The id and index should be same for one form element. The index should be the name of column in your database table. If these are not set correct, the data cant be saved to DB, which throws an exception.',
          'Label - The display label value of the form element.',
          'Placeholder - The placeholder of form element for user info.',
          'className - For styling. You can use the in built <a target="_blank" href="https://getbootstrap.com/docs/5.0/forms/overview/" class="btn-link">Bootstrap</a> class names of your choice.',
          '<b>Options:</b>',
          'These fields are optional. You can set them if you want to.',
          'required - Denotes a red asterisk(*) to the user that this field is important and required.',
          'validation - You can set a form element validation using RegExp. Some of them are described as below',
          'Tips:',
          'Here are some validation rules you can set..',
          'No validation - <span class="badge bg-secondary">/$/</span>',
          'Atleast 1 character is required - <span class="badge bg-secondary">/([^s])/</span>',
          '10 digit numeric validation - <span class="badge bg-secondary">/^[0-9]{10}$/</span>',
          'Email validation - <span class="badge bg-secondary">/^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,5})+$/</span>',
          'Min 4 & Max 20 length alphanumeric validation - <span class="badge bg-secondary">/^[a-zA-Z0-9 ]{4,20}$/g</span>',
          `Min 8 letters long, Atleast 1 Capital letter, Atleast 1 Special (!@#$%^&*_) character Atleast 1 Number validation - <span class="badge bg-secondary">/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_])(?=.{8,})/</span>`,
          'errorMsg - This message would popup if the user key-in validation fails. Ex: Enter a valid 10 digit mobile number.',
        ],
      },
    },
    {
      id: 3,
      label: 'Ajax Fetch',
      body: <CreateAjaxFetch />,
      help: {
        heading: 'Ajax Fetch help',
        points: [
          'A dynamic Ajax Fetch module is available for you to retrieve informations saved in your database.',
          'Hope your table(s) in database is configured correctly and users can push data to them.',
          'Lets pull those data in a table format to view them.',
          'Add fields - Type your column name and click plus button to add one by one. This helps to write your clauses and selection. You can remove (click cross button) them if not required.  Note: The column names can be found in the Database config panel (popup window) in side menu for your reference.',
          '<a target="_blank" href="https://www.w3schools.com/sql/sql_select.asp" class="btn-link">Select</a> - These are the selected columns which will be displayed in the table. You can add column name, alias name or aggregate functions, based on your requirement.',
          '<a target="_blank" href="https://w3schools.com/sql/sql_top.asp" class="btn-link">From</a> - The TABLE pull down which has list of configured tables in your database. Select one.',
          '<a target="_blank" href="https://https://www.w3schools.com/sql/sql_where.asp" class="btn-link">Where</a> - Declare your where conditions if required. Select COLUMN and CLAUSE from pull downs, key in your condition in the text box and click the plus button. Ex: COLUMN - "blogGender", CLAUSE - "EQUAL TO", text box value - "Male". Like wise add n number of conditions wherever required. Note: You can leave where field blank if not required.',
          '<a target="_blank" href="https://w3schools.com/sql/sql_orderby.asp" class="btn-link">Order By</a> - To sort data in required order, use this fied. This is some how similar to above where clause, except you dont have a text box.  Ex: COLUMN - "blogName", CLAUSE - "ASC" to sort data ascending to blogName. You can select ASC/DESC of your choice.',
          '<a target="_blank" href="https://w3schools.com/sql/sql_groupby.asp" class="btn-link">Group By</a> - To group or summarize data. This is usefull when you have aggregate functions COUNT(), MAX(), MIN(), SUM(), AVG() in your select field. Once your aggregates are set, select the column for which you like to groupfrom the COLUMN pull down.',
          '<a target="_blank" href="https://w3schools.com/sql/sql_top.asp" class="btn-link">Limit</a> - Limit your record count. Please dont set limit to thousands as the fetching gets delayed and reduces performance during large quantum of data. Keep the Limit value in short as 100',
          'Once all your clauses are added, click the thumbs up <i class="fa fa-thumbs-up"></i> button to push changes to form and see your output in the preview tab.',
          'Dont forget to Save & Publish once done.',
        ],
      },
    },
    {
      id: 4,
      label: 'Database',
      body: <Database />,
      help: {
        heading: 'Database help',
        points: [
          'Database - Table config module helps you to create and maintain tables in your database.',
          'This module consist of a table list and information section.',
          '<b>Create table form requires the following fields</b>',
          'Table name - A name for the table.',
          'Field name - A name for column / field.',
          'Select Type - A data type for your field. Select one.',
          'Constraint - Ex: 11 for data type INT | 10,2 for DECIMAL | 5 for CHAR etc.. Leave blank if not required.',
          '<b>Pull down options</b>',
          'Auto Increment - Set check box ticked to add auto_increment',
          'Unsigned - Set check box ticked to avoid storing negative values',
          'Null - Set check box ticked if the field is null',
          'Default - Type the default value which gets saved during insert. Ex: CURRENT_TIMESTAMP for DATETIME data type',
          'Primary / Index key - Set a key for your field as an identifier.',
          'Click the plus button to add field. Like wise add "n" number of fields as you prefer.',
          'Click create button to create table. A success message is shown or an exception / error is thrown in case of wrong schema defenition.',
          'You can add a column to existing table on clicking Add Column button. The sequence is same as above.',
          'On success, the created table will be shown on the left side menu with options.',
          '<b>Table Information</b>',
          'This tabular content describes the information of table. This is usefull while configuring Ajax Form and Ajax Fetch',
          '<b>Table List</b>',
          'This lists down tables as button group of table name and options.',
          'The name click renders table information.',
          'The option button click shows list of options as Rename, Empty Table and Drop Table.',
          'Update rename text box and click the thumbs up <i class="fa fa-thumbs-up"></i> button to rename table.',
          'Be carefull on clicking Empty Table and Drop Table as you may lose data, which cannot be undone.',
          'Once all the above are done, you are ready to setup Ajax Form and Ajax Fetch.',
        ],
      },
    },
  ]);

  useEffect(() => {
    window.addEventListener('scroll', listenToScroll);
  }, []);

  const listenToScroll = () => {
    const height = window.pageYOffset;
    setScrollPosition(height);
  };

  const CustomToggle = ({ children, eventKey, object }) => {
    const decoratedOnClick = useAccordionButton(eventKey, () => null);

    return (
      <button
        type="button"
        className={`col-11 btn-sm text-start btn ${
          userContext.userData.theme === 'dark' ? 'btn-dark' : 'btn-white'
        }`}
        onClick={decoratedOnClick}
      >
        {children}
      </button>
    );
  };

  return (
    <div ref={ref}>
      {layoutContext.state.pageDetails &&
        Object.keys(layoutContext.state.pageDetails).length > 0 && (
          <div
            className={`pt-2 pb-5 ${
              userContext.userData.theme === 'light' ? 'bg-light' : 'bg-dark'
            }`}
            style={{
              ...(scrollPosition > 100 &&
                window.innerWidth > 820 && {
                  position: 'fixed',
                  top: appData.webMenuType === 'topMenu' ? '100px' : '50px',
                  width: `${ref.current.offsetWidth}px`,
                }),
            }}
          >
            <div
              style={{
                ...(scrollPosition > 100 &&
                  window.innerWidth > 768 && {
                    overflowY: 'auto',
                    height:
                      appData.webMenuType === 'topMenu'
                        ? 'calc(100vh - 150px)'
                        : 'calc(100vh - 100px)',
                  }),
              }}
            >
              <Accordion defaultActiveKey={-1} alwaysOpen>
                {sideMenu.map((side, i) => (
                  <Card
                    key={side.id}
                    className={`mb-1 ${
                      userContext.userData.theme === 'dark'
                        ? 'bg-dark text-light'
                        : 'bg-light text-dark'
                    }`}
                  >
                    <Card.Header className="row m-0 p-0">
                      <CustomToggle eventKey={side.id} object={side}>
                        {side.label}
                      </CustomToggle>
                      <OffCanvas
                        className={`text-center ${
                          userContext.userData.theme === 'dark'
                            ? 'bg-dark text-white-50'
                            : 'bg-light text-black'
                        }`}
                        btnValue="<i class='fa fa-question-circle' />"
                        btnClassName={`col-1 btn btn-sm ${
                          userContext.userData.theme === 'dark'
                            ? 'text-light'
                            : 'text-dark'
                        }`}
                        placement="end"
                        key={side.id}
                        label={side.help.heading}
                      >
                        {side.help.points.length > 0 && (
                          <ul className={`list-group list-group-flush`}>
                            {side.help.points.map((point, j) => (
                              <li
                                key={j}
                                className={`list-group-item ${
                                  userContext.userData.theme === 'dark'
                                    ? 'bg-dark text-white-50'
                                    : 'bg-light text-black'
                                }`}
                                dangerouslySetInnerHTML={{ __html: point }}
                              ></li>
                            ))}
                          </ul>
                        )}
                      </OffCanvas>
                    </Card.Header>
                    <Accordion.Collapse eventKey={side.id}>
                      <Card.Body className="p-1">
                        {side.body && side.body}
                        {side.children &&
                          side.children.length > 0 &&
                          side.children.map((ch, j) => (
                            <Accordion
                              key={ch.id}
                              defaultActiveKey={[]}
                              alwaysOpen
                            >
                              {' '}
                              {/* defaultActiveKey={[0.2]} alwaysOpen */}
                              <Card
                                key={ch.id}
                                className={`mb-1 ${
                                  userContext.userData.theme === 'dark'
                                    ? 'bg-dark text-light'
                                    : 'bg-light text-dark'
                                }`}
                              >
                                <Card.Header className="row m-0 p-0">
                                  <CustomToggle eventKey={ch.id} object={side}>
                                    {ch.label}
                                  </CustomToggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey={ch.id}>
                                  <Card.Body className="p-1">
                                    {ch.body}
                                  </Card.Body>
                                </Accordion.Collapse>
                              </Card>
                            </Accordion>
                          ))}
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                ))}
              </Accordion>
            </div>
          </div>
        )}
    </div>
  );
}

export default SideMenu;
