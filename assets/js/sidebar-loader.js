// sidebar-loader.js
(function($) {
    
    // Load sidebar on document ready
    $(document).ready(function() {
        loadSidebar();
    });
    
    function loadSidebar() {
        fetch('sidebar.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(html => {
                const sidebarContainer = document.getElementById('sidebar-container');
                if (sidebarContainer) {
                    sidebarContainer.innerHTML = html;
                    
                    // Re-initialize the sidebar functionality from main.js
                    reinitializeSidebar();
                }
            })
            .catch(error => {
                console.error('Error loading sidebar:', error);
                // Fallback: show a basic sidebar or error message
                const sidebarContainer = document.getElementById('sidebar-container');
                if (sidebarContainer) {
                    sidebarContainer.innerHTML = '<div id="sidebar" class="inactive"><div class="inner"><p>Menu temporarily unavailable</p></div></div>';
                }
            });
    }
    
    function reinitializeSidebar() {
        // Re-run the sidebar initialization from main.js
        var $sidebar = $('#sidebar'),
            $sidebar_inner = $sidebar.children('.inner'),
            $window = $(window),
            $body = $('body');

        // Only add toggle if it doesn't exist
        if ($sidebar.find('.toggle').length === 0) {
            $('<a href="#sidebar" class="toggle">Toggle</a>')
                .appendTo($sidebar)
                .on('click', function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    $sidebar.toggleClass('inactive');
                });
        }

        // Re-initialize menu openers
        var $menu = $('#menu'),
            $menu_openers = $menu.children('ul').find('.opener');

        $menu_openers.each(function() {
            var $this = $(this);
            
            // Remove any existing click handlers to prevent duplicates
            $this.off('click');
            
            $this.on('click', function(event) {
                event.preventDefault();
                $menu_openers.not($this).removeClass('active');
                $this.toggleClass('active');
                $window.triggerHandler('resize.sidebar-lock');
            });
        });

        // Trigger window resize to reinitialize scroll lock
        $window.triggerHandler('resize.sidebar-lock');
    }
    
})(jQuery);