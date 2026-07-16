import {
    Boxes,
    Building2,
    PackageCheck,
    Sofa,
    Trash2,
    Truck,
    Warehouse,
    Wrench,
} from "lucide-react";

export const services = [
    {
        slug: "home-moves",
        title: "Home Moves",
        description:
            "Careful apartment and house relocations, planned around your property, access conditions and moving date.",
        icon: Truck,
        features: [
            "Furniture protection",
            "Loading and unloading",
            "Local and long-distance transport",
            "Floor and elevator planning",
        ],
        price: "From €250",
    },
    {
        slug: "office-relocation",
        title: "Office Relocation",
        description:
            "Organised office and commercial moves designed to minimise disruption to your business.",
        icon: Building2,
        features: [
            "Office furniture transport",
            "Equipment handling",
            "Flexible moving schedules",
            "Team and vehicle planning",
        ],
        price: "From €600",
    },
    {
        slug: "furniture-transport",
        title: "Furniture Transport",
        description:
            "Reliable transport for individual furniture pieces, marketplace purchases and private deliveries.",
        icon: Sofa,
        features: [
            "Subito purchases",
            "Marketplace collections",
            "Private furniture delivery",
            "Protective wrapping",
        ],
        price: "Custom estimate",
    },
    {
        slug: "ikea-pickup",
        title: "IKEA Pickup & Delivery",
        description:
            "Collection, delivery and optional assembly for furniture purchased from IKEA and similar stores.",
        icon: Boxes,
        features: [
            "Store collection",
            "Home delivery",
            "Packaging removal",
            "Optional assembly",
        ],
        price: "Custom estimate",
    },
    {
        slug: "packing-unpacking",
        title: "Packing & Unpacking",
        description:
            "Professional packing support for household belongings, fragile items and furniture.",
        icon: PackageCheck,
        features: [
            "Packing materials",
            "Fragile-item protection",
            "Labelling and organisation",
            "Unpacking support",
        ],
        price: "From €80",
    },
    {
        slug: "furniture-assembly",
        title: "Furniture Assembly",
        description:
            "Furniture disassembly before transport and careful reassembly at the destination.",
        icon: Wrench,
        features: [
            "Bed disassembly",
            "Wardrobe disassembly",
            "Furniture reassembly",
            "Basic installation support",
        ],
        price: "From €50",
    },
    {
        slug: "storage",
        title: "Temporary Storage",
        description:
            "Short-term storage coordination when your new property is not ready immediately.",
        icon: Warehouse,
        features: [
            "Short-term storage",
            "Collection and redelivery",
            "Inventory coordination",
            "Flexible storage periods",
        ],
        price: "Custom estimate",
    },
    {
        slug: "house-clearance",
        title: "House Clearances",
        description:
            "Removal of unwanted furniture, household items and materials from apartments, houses and offices.",
        icon: Trash2,
        features: [
            "Furniture removal",
            "Property clearance",
            "Loading and transport",
            "Disposal coordination",
        ],
        price: "Custom estimate",
    },
];