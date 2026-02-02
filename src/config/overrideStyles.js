const overrideStyles =  `
        /* Dropdown container positioning */
        #brad-search-dropdown-scroll {
          top: 2.25rem !important;
          left: 0 !important;
          border-radius: 0 !important;
        }
        
        /* Side panel rounded corners */
        .h-full.overflow-y-auto.rounded-lg.drop-shadow-xl.md\\:bg-searchResultsBg {
          border-radius: 0 !important;
        }
        
        .h-full.w-full.rounded-lg.bg-inherit.font-filters {
          border-radius: 0 !important;
        }
        
        /* Product card (list) rounded corners */
        .group.relative.h-full.transform.overflow-hidden.rounded-lg {
          border-radius: 0 !important;
        }
        
        /* Section headers (BRANDS, CATEGORIES) */
        h2.font-global.font-bold.uppercase.tracking-wider {
          font-size: 16px !important;
        }
        
        /* Brand/category item text */
        .truncate.text-textDefault {
          font-size: 16px !important;
        }

        /* REMOVE truncate behaviour for brand/category items */
        .truncate.text-textDefault.group-hover\\:text-cardText {
          overflow: visible !important;
          white-space: normal !important;
          text-overflow: clip !important;
        }
        
        /* Count numbers */
        .text-md.ml-auto.text-gray-400 {
          font-size: 14px !important;
}`;

export default overrideStyles;
