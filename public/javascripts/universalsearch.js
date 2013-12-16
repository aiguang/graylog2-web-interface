$(document).ready(function() {

    $(".timerange-chooser .dropdown-menu a").on("click", function() {
        var selectorName = $(this).attr("data-selector-name");
        var link = $(this);

        activateTimerangeChooser(selectorName, link);
    });

    $("#universalsearch .timerange-selector-container .absolute .date-select").datepicker({
        format: "yyyy-mm-dd"
    }).on("changeDate", function(ev) {
        $(this).val($(this).val() + " 00:00:00");
    });

    $("#universalsearch .timerange-selector-container .absolute .set-to-now").on("click", function() {
        var input = $("input", $(this).parent());

        var date = new Date();
        input.val(searchDateTimeFormatted(date));
    });

    $("#universalsearch .timerange-selector-container .keyword input").typeWatch({
        callback: function (string) {
            var preview = $("#universalsearch .timerange-selector-container .keyword .keyword-preview");
            if (string.length == 0) {
                preview.hide();
                return;
            }

            $.ajax({
                url: '/a/tools/natural_date_test',
                data: {
                    "string": string,
                },
                success: function(data) {
                    $(".not-recognized").hide();

                    $(".from", preview).text(data.from);
                    $(".to", preview).text(data.to);
                    $(".fromto", preview).show();
                },
                statusCode: { 422: function() {
                    $(".fromto", preview).hide();
                    $(".not-recognized").show();
                }},
                complete: function() {
                    preview.show();
                }
            });
        },
        wait: 500,
        highlight: true,
        captureLength: 0
    });

    // Save a search: Open save dialog.
    $(".save-search").on("click", function(e) {
        e.preventDefault();

        $(this).hide();
        $(".save-search-form").show();
    });

    // Save a search: Ask for title and actually trigger saving.
    $(".save-search-form button.do-save").on("click", function(e) {
        e.preventDefault();

        var input = $("#save-search-title");
        var button = $(this);
        var title = input.val();

        button.prop("disabled", true);
        input.prop("disabled", true);

        button.html("<i class='icon icon-spin icon-spinner'></i>&nbsp; Saving");

        var params = {};
        params.query = originalUniversalSearchSettings();
        params.title = title

        $.ajax({
            url: '/savedsearches/create',
            type: 'POST',
            data: {
                "params": JSON.stringify(params)
            },
            success: function(data) {
                button.html("<i class='icon icon-ok'></i>&nbsp; Saved");
            },
            error: function(data) {
                button.html("<i class='icon icon-warning-sign'></i>&nbsp; Failed");
                button.switchClass("btn-success", "btn-danger");
                showError("Could not save search.")
            }
        });

    });

    // Enable save button when text is entered.
    $("#save-search-title").on("keyup", function(e) {
        var button = $(".save-search-form button.do-save");
        if($(this).val() != undefined && $(this).val().trim() != "") {
            button.prop("disabled", false);
        } else {
            button.prop("disabled", true);
        }
    });

});

function activateTimerangeChooser(selectorName, link) {
    $(".timerange-selector").hide();
    $("#universalsearch .timerange-selector-container .keyword .preview").hide();
    $("#universalsearch-rangetype").val(selectorName);
    $(".timerange-selector input,select").attr("disabled", "disabled");

    var selected = $("." + selectorName, $(".universalsearch-form"));
    selected.show();
    $("input,select", selected).removeAttr("disabled");

    $("a", link.parent().parent()).removeClass("selected");
    link.addClass("selected");
}