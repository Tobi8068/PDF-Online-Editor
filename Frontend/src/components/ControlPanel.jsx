import React from 'react';

const ControlPanel = (props) => {
  const { pageNumber, numPages, setPageNumber, scale, setScale } = props;

  const isFirstPage = pageNumber === 1;
  const isLastPage = pageNumber === numPages;

  const firstPageClass = isFirstPage ? 'disabled' : 'clickable';
  const lastPageClass = isLastPage ? 'disabled' : 'clickable';

  const goToFirstPage = () => {
    if (!isFirstPage) setPageNumber(1);
  };
  const goToPreviousPage = () => {
    if (!isFirstPage) setPageNumber(pageNumber - 1);
  };
  const goToNextPage = () => {
    if (!isLastPage) setPageNumber(pageNumber + 1);
  };
  const goToLastPage = () => {
    if (!isLastPage) setPageNumber(numPages);
  };

  const onPageChange = (e) => {
    const { value } = e.target;
    setPageNumber(Number(value));
  };

  const isMinZoom = scale < 0.6;
  const isMaxZoom = scale >= 2.0;

  const zoomOutClass = isMinZoom ? 'disabled' : 'clickable';
  const zoomInClass = isMaxZoom ? 'disabled' : 'clickable';

  const zoomOut = () => {
    if (!isMinZoom) setScale(scale - 0.1);
  };

  const zoomIn = () => {
    if (!isMaxZoom) setScale(scale + 0.1);
  };

  return (
    <div className="control-panel p-4 d-flex align-items-baseline justify-content-between">
      <div className="d-flex justify-content-between align-items-baseline">
        <i
          className={`fas fa-chevron-left mx-3 ${firstPageClass}`}
          onClick={goToFirstPage}
        />
        <i
          className={`fas fa-chevron-up mx-3 ${firstPageClass}`}
          onClick={goToPreviousPage}
        />
        <span className='mx-3'>
          <input
            name="pageNumber"
            type="number"
            min={1}
            max={numPages || 1}
            className="p-0 pl-1 mx-2"
            value={pageNumber}
            onChange={onPageChange}
          />
          /{numPages}{' '}5
        </span>
        <i
          className={`fas fa-chevron-down mx-3 ${lastPageClass}`}
          onClick={goToNextPage}
        />
        <i
          className={`fas fa-chevron-right mx-3 ${lastPageClass}`}
          onClick={goToLastPage}
        />

        <i
          className={`fas fa-search-minus ms-5 me-3 ${zoomOutClass}`}
          onClick={zoomOut}
        />
        <span>{(scale * 100).toFixed()}%</span>
        <i
          className={`fas fa-search-plus mx-3 ${zoomInClass}`}
          onClick={zoomIn}
        />
      </div>
      <div className="mx-3">
        <a href="1.pdf" download={true} title="download">
          <i className="fas fa-download clickable" />
        </a>
      </div>
    </div>
  );
};

export default ControlPanel;
