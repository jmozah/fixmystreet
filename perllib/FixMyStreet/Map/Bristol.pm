# FixMyStreet:Map::Bristol
# Bristol use their own tiles on their cobrand

package FixMyStreet::Map::Bristol;
use base 'FixMyStreet::Map::WMTSBase';

use strict;

sub zoom_parameters {
    my $self = shift;
    my $params = {
        zoom_levels    => scalar $self->scales,
        default_zoom   => 5,
        min_zoom_level => 0,
        id_offset      => 0,
    };
    return $params;
}

sub tile_parameters {
    my $self = shift;
    my $params = {
        url        => 'https://maps.bristol.gov.uk/arcgis/rest/services/base/2015_BCC_96dpi/MapServer/tile',
        suffix     => '', # appended to tile URLs
        size       => 256, # pixels
        dpi        => 96,
        origin_x   => 4470200,
        origin_y   => -5220400,
    };
    return $params;
}

sub scales {
    my $self = shift;
    my @scales = (
        '192000', # resolution: 50.800101600203206
        '96000', # resolution: 25.400050800101603
        '48000', # resolution: 12.700025400050801
        '24000', # resolution: 6.350012700025401
        '12000', # resolution: 3.1750063500127004
        '6000', # resolution: 1.5875031750063502
        '3000', # resolution: 0.7937515875031751
        '1250', # resolution: 0.33072982812632296
        '750', # resolution: 0.19843789687579377
    );
    return @scales;
}

sub inches_per_unit {
    # BNG uses metres
    return 39.3701;
}

sub copyright {
    return '&copy; BCC';
}

# Reproject a WGS84 lat/lon into BNG easting/northing
sub reproject_from_latlon($$$) {
    my ($self, $lat, $lon) = @_;
    my ($x, $y) = Utils::convert_latlon_to_en($lat, $lon);
    return ($x, $y);
}

# Reproject a BNG easting/northing into WGS84 lat/lon
sub reproject_to_latlon($$$) {
    my ($self, $x, $y) = @_;
    my ($lat, $lon) = Utils::convert_en_to_latlon($x, $y);
    return ($lat, $lon);
}

1;
