package FixMyStreet::Cobrand::Bristol;
use parent 'FixMyStreet::Cobrand::UKCouncils';

use strict;
use warnings;

sub council_id { return 2561; }
sub council_area { return 'Bristol'; }
sub council_name { return 'Bristol County Council'; }
sub council_url { return 'bristol'; }

sub example_places {
    return ( 'BS1 5TR', "Broad Quay" );
}

sub map_type {
    'Bristol';
}

sub disambiguate_location {
    my $self    = shift;
    my $string  = shift;

    my $town = 'Bristol';

    return {
        %{ $self->SUPER::disambiguate_location() },
        town   => $town,
        centre => '51.4526044866206,-2.7706173308649',
        span   => '0.202810508012753,0.60740886659825',
        bounds => [ 51.3415749466466, -3.11785543094126, 51.5443854546593, -2.51044656434301 ],
    };
}

sub pin_colour {
    my ( $self, $p, $context ) = @_;
    return 'grey' if $p->state eq 'not responsible';
    return 'green' if $p->is_fixed || $p->is_closed;
    return 'red' if $p->state eq 'confirmed';
    return 'yellow';
}

sub contact_email {
    my $self = shift;
    return join( '@', 'customer.services', 'bristol.gov.uk' );
}

1;
